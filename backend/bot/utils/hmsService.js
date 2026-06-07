const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const hmsDb = require('../../models');

const Op = hmsDb.Sequelize.Op;

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

const getPublicFileUrl = (filename) => {
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  return `${apiBaseUrl}/public/uploads/${filename}`;
};

const sanitizeFilename = (filename = 'telegram-file') => {
  return filename
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
};

exports.verifyHmsUserByPhone = async (phone) => {
  const mobile = normalizePhone(phone);

  if (!mobile) {
    return null;
  }

  const loginUser = await hmsDb.users.findOne({
    where: { mobile, isActive: true }
  });

  if (!loginUser) {
    return null;
  }

  if (loginUser.role === 'Hostel-Authority') {
    const authority = await hmsDb.hostelauthoritys.findOne({
      where: { email: loginUser.email, isActive: true }
    });

    if (authority) {
      return {
        role: 'Hostel-Authority',
        name: authority.name,
        email: authority.email,
        hostelNo: authority.hostelNo,
        phone: mobile
      };
    }
  }

  if (loginUser.role === 'Student') {
    const student = await hmsDb.students.findOne({ where: { email: loginUser.email } });

    if (student) {
      return {
        role: 'Student',
        name: `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.email,
        email: student.email,
        rollNo: student.rollNo,
        hostelNo: student.hostelNo,
        phone: mobile
      };
    }
  }

  if (loginUser.role === 'SuperAdmin') {
    return {
      role: 'SuperAdmin',
      name: 'Super Admin',
      email: loginUser.email,
      phone: mobile
    };
  }

  return null;
};

exports.getComplaintsForSession = async (session) => {
  if (session.role === 'SuperAdmin') {
    return hmsDb.complaints.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
  }

  const where = session.role === 'Student'
    ? { rollNo: session.rollNo }
    : { hostelNo: session.hostelNo };

  return hmsDb.complaints.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: 10
  });
};

exports.getNoticesForSession = async (session) => {
  if (session.role === 'SuperAdmin') {
    return hmsDb.notices.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10
    });
  }

  return hmsDb.notices.findAll({
    where: {
      [Op.or]: [
        { hostelNo: session.hostelNo },
        { isGlobal: true }
      ]
    },
    order: [['createdAt', 'DESC']],
    limit: 10
  });
};

exports.getStudentDetailsForSession = async (session, requestedRollNo = null) => {
  const rollNo = requestedRollNo || session.rollNo;

  if (!rollNo) {
    throw new Error('Please provide a roll number. Example: student 123 details');
  }

  if (session.role === 'Student' && Number(rollNo) !== Number(session.rollNo)) {
    throw new Error('Students can only view their own details.');
  }

  const student = await hmsDb.students.findOne({ where: { rollNo } });

  if (!student) {
    throw new Error('Student not found.');
  }

  if (session.role === 'Hostel-Authority' && Number(student.hostelNo) !== Number(session.hostelNo)) {
    throw new Error('You can only view students from your hostel.');
  }

  const [profile, mapping, course] = await Promise.all([
    hmsDb.profiles.findOne({ where: { rollNo } }),
    hmsDb.roomsStudentMappings.findOne({ where: { rollNo } }),
    student.courseId ? hmsDb.courses.findOne({ where: { courseId: student.courseId } }) : null
  ]);

  const room = mapping?.roomId
    ? await hmsDb.rooms.findOne({ where: { roomId: mapping.roomId } })
    : null;

  return { student, profile, room, course };
};

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

exports.getMessMenuForSession = async (session) => {
  const hostelNo = session.hostelNo;
  if (!hostelNo) throw new Error('Your account is not linked to a hostel.');

  const rows = await hmsDb.messMenu.findAll({
    where: { hostelNo },
    order: hmsDb.Sequelize.literal(
      `FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')`
    )
  });

  return DAYS_ORDER.map(day => {
    const row = rows.find(r => r.day === day);
    return {
      day,
      breakfast: row?.breakfast || '',
      lunch: row?.lunch || '',
      snacks: row?.snacks || '',
      dinner: row?.dinner || '',
    };
  });
};

exports.getHostelsList = async () => {
  return hmsDb.hostels.findAll({
    attributes: ['hostelNo', 'hostelName', 'type'],
    order: [['hostelNo', 'ASC']]
  });
};

exports.getRoomDetailsForSession = async (session, { hostelNo = null, roomNo = null } = {}) => {
  if (!['Hostel-Authority', 'SuperAdmin'].includes(session.role)) {
    throw new Error('Only Hostel Authority or Super Admin can view room details.');
  }

  const effectiveHostelNo = session.role === 'Hostel-Authority' ? session.hostelNo : hostelNo;

  if (!effectiveHostelNo) {
    throw new Error('Hostel number is required.');
  }

  const where = { hostelNo: effectiveHostelNo };
  if (roomNo) where.roomNo = roomNo;

  const rooms = await hmsDb.rooms.findAll({
    where,
    order: [['roomNo', 'ASC']],
    limit: roomNo ? 5 : 30
  });

  if (!rooms.length) {
    throw new Error(roomNo
      ? `No room found with number ${roomNo} in Hostel ${effectiveHostelNo}.`
      : `No rooms found for Hostel ${effectiveHostelNo}.`
    );
  }

  if (roomNo) {
    const mappings = await hmsDb.roomsStudentMappings.findAll({
      where: { roomId: rooms[0].roomId }
    });
    const rollNos = mappings.map(m => m.rollNo);
    const students = rollNos.length
      ? await hmsDb.students.findAll({ where: { rollNo: rollNos } })
      : [];
    return { rooms, students, hostelNo: effectiveHostelNo };
  }

  return { rooms, students: [], hostelNo: effectiveHostelNo };
};

exports.getVacantRoomsForSession = async (session, { hostelNo = null, type = 'any' } = {}) => {
  if (!['Hostel-Authority', 'SuperAdmin'].includes(session.role)) {
    throw new Error('Only Hostel Authority or Super Admin can view room availability.');
  }

  const effectiveHostelNo = session.role === 'Hostel-Authority' ? session.hostelNo : hostelNo;

  if (!effectiveHostelNo) {
    throw new Error('Hostel number is required.');
  }

  const allRooms = await hmsDb.rooms.findAll({
    where: { hostelNo: effectiveHostelNo },
    order: [['roomNo', 'ASC']]
  });

  const filtered = allRooms.filter(r => {
    const curr = Number(r.currentOccupancy) || 0;
    const max = Number(r.maxOccupancy) || 0;
    if (type === 'vacant') return curr === 0 && max > 0;
    if (type === 'partial') return curr > 0 && curr < max;
    return curr < max; // any available space
  });

  return { rooms: filtered, hostelNo: effectiveHostelNo, type };
};

exports.getApplicationsForSession = async (session) => {
  if (!['Hostel-Authority', 'SuperAdmin'].includes(session.role)) {
    throw new Error('Only Hostel Authority or Super Admin can view applications.');
  }

  if (session.role === 'SuperAdmin') {
    return hmsDb.Application.findAll({
      order: [['createdAt', 'DESC']],
      limit: 15
    });
  }

  return hmsDb.Application.findAll({
    where: { toAdminId: session.email },
    order: [['createdAt', 'DESC']],
    limit: 10
  });
};

exports.createNoticeFromTelegramFile = async ({ bot, message, session, title, description }) => {
  const document = message.document;
  const photo = message.photo?.at(-1);
  const fileId = document?.file_id || photo?.file_id;
  const originalName = document?.file_name || `telegram-photo-${Date.now()}.jpg`;

  if (!fileId) {
    throw new Error('Please send a PDF, JPG, JPEG, or PNG file.');
  }

  const mimeType = document?.mime_type || 'image/jpeg';
  const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']);

  if (!allowedMimeTypes.has(mimeType)) {
    throw new Error('Only PDF, JPG, JPEG, and PNG files are allowed.');
  }

  const fileSize = document?.file_size || photo?.file_size || 0;
  if (fileSize > 5 * 1024 * 1024) {
    throw new Error('File is too large. Maximum allowed size is 5MB.');
  }

  const fileLink = await bot.getFileLink(fileId);
  const response = await fetch(fileLink);

  if (!response.ok) {
    throw new Error('Could not download the Telegram file.');
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = `${Date.now()}-${sanitizeFilename(originalName)}`;
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);

  await fs.mkdir(path.dirname(uploadPath), { recursive: true });
  await fs.writeFile(uploadPath, buffer);

  return hmsDb.notices.create({
    title,
    description: description || null,
    url: getPublicFileUrl(filename),
    public_id: randomUUID(),
    hostelNo: session.role === 'SuperAdmin' ? null : session.hostelNo,
    isGlobal: session.role === 'SuperAdmin',
    priority: 'medium'
  });
};

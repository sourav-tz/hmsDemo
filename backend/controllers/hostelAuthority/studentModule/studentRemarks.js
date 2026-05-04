const db = require('../../../models');
const { uploadToCloudinary } = require('../../../utils/cloudinary');
const { Op } = require('sequelize');

const getActorName = async (req) => {
  if (req.user.role === 'Hostel-Authority') {
    const authority = await db.hostelauthoritys.findOne({
      where: { email: req.user.email },
      attributes: ['name'],
    });

    return authority?.name || req.user.email;
  }

  return 'Super Admin';
};

const getStudentForAccess = async (rollNo) => {
  return db.students.findOne({
    where: { rollNo },
    attributes: ['rollNo', 'hostelNo', 'firstName', 'lastName'],
  });
};

const ensureCanAccessStudent = async (req, res, rollNo) => {
  const student = await getStudentForAccess(rollNo);

  if (!student) {
    res.status(404).json({ message: 'Student not found' });
    return null;
  }

  if (req.user.role === 'Hostel-Authority' && student.hostelNo !== req.user.hostelNo) {
    res.status(403).json({ message: 'You can only manage remarks for students in your hostel' });
    return null;
  }

  return student;
};

const normalizeRemarks = (remarks) => {
  if (typeof remarks !== 'string') {
    return '';
  }

  return remarks.trim();
};

const getSeenColumnForRole = (role) => {
  if (role === 'Hostel-Authority') {
    return 'seenByHostelAuthorityAt';
  }

  if (role === 'SuperAdmin') {
    return 'seenBySuperAdminAt';
  }

  return null;
};

exports.getStudentRemarks = async (req, res) => {
  try {
    if (!['Hostel-Authority', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not allowed to view student remarks' });
    }

    const rollNo = Number(req.params.rollNo);
    const student = await ensureCanAccessStudent(req, res, rollNo);

    if (!student) {
      return;
    }

    const seenColumn = getSeenColumnForRole(req.user.role);
    if (seenColumn) {
      await db.studentRemarks.update(
        { [seenColumn]: new Date() },
        {
          where: {
            rollNo,
            [seenColumn]: {
              [Op.is]: null,
            },
          },
        }
      );
    }

    const remarks = await db.studentRemarks.findAll({
      where: { rollNo },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      student,
      remarks,
    });
  } catch (error) {
    console.error('Error fetching student remarks:', error);
    return res.status(500).json({ message: 'Failed to fetch student remarks' });
  }
};

exports.createStudentRemark = async (req, res) => {
  try {
    if (!['Hostel-Authority', 'SuperAdmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not allowed to add student remarks' });
    }

    const rollNo = Number(req.params.rollNo);
    const student = await ensureCanAccessStudent(req, res, rollNo);

    if (!student) {
      return;
    }

    const remarks = normalizeRemarks(req.body.remarks);
    const hasAttachment = Boolean(req.file);

    const isAllowedAttachment = hasAttachment && (
      req.file.mimetype?.startsWith('image/') ||
      req.file.mimetype === 'application/pdf'
    );

    if (hasAttachment && !isAllowedAttachment) {
      return res.status(400).json({
        message: 'Only image or PDF attachments are allowed for student remarks',
      });
    }

    if (!remarks && !hasAttachment) {
      return res.status(400).json({
        message: 'Please provide a textual remark, an image attachment, or both',
      });
    }

    let attachmentUrl = null;
    let attachmentPublicId = null;

    if (hasAttachment) {
      const uploadResult = await uploadToCloudinary(req.file, 'student_remarks');
      attachmentUrl = uploadResult.url;
      attachmentPublicId = uploadResult.public_id;
    }

    const createdByName = await getActorName(req);
    const createdAt = new Date();
    const seenByHostelAuthorityAt = req.user.role === 'Hostel-Authority' ? createdAt : null;
    const seenBySuperAdminAt = req.user.role === 'SuperAdmin' ? createdAt : null;

    const createdRemark = await db.studentRemarks.create({
      rollNo,
      remarks: remarks || null,
      fileAttachment: attachmentUrl,
      fileAttachmentPublicId: attachmentPublicId,
      createdByEmail: req.user.email,
      createdByName,
      createdByRole: req.user.role,
      seenByHostelAuthorityAt,
      seenBySuperAdminAt,
    });

    return res.status(201).json({
      message: 'Remark added successfully',
      remark: createdRemark,
    });
  } catch (error) {
    console.error('Error creating student remark:', error);
    return res.status(500).json({ message: 'Failed to add student remark' });
  }
};

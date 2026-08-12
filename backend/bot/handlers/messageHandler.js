const { getReplyForMessage } = require('../utils/replies');
const { logger } = require('../utils/logger');
const { clearSession, getSession, saveSession } = require('../utils/sessionStore');
const {
  getConversation,
  getDisplayName,
  getSalutation,
  updateConversation
} = require('../utils/conversationStore');
const {
  createNoticeFromTelegramFile,
  getApplicationsForSession,
  getComplaintsForSession,
  getHostelsList,
  getMessMenuForSession,
  getNoticesForSession,
  getRoomDetailsForSession,
  getVacantRoomsForSession,
  getStudentDetailsForSession,
  verifyHmsUserByPhone
} = require('../utils/hmsService');

const activeChats = new Set();
const pendingActions = new Map();

const normalizeText = (value) => value.trim().toLowerCase();

const buildAddress = (conversation) => {
  const salutation = getSalutation(conversation);
  if (salutation) return salutation;
  return getDisplayName(conversation, '');
};

const isGreeting = (text) =>
  /^(hi+|hello+|hey|hii|helo|helllo|good morning|good afternoon|good evening)\b/i.test(text.trim());

const extractName = (text) => {
  const cleaned = text.trim();
  const match = cleaned.match(/(?:my name is|i am|i'm|this is)\s+([a-zA-Z][a-zA-Z\s.'-]{1,40})$/i);
  const name = (match?.[1] || cleaned).replace(/[^a-zA-Z\s.'-]/g, '').trim();

  if (!name || name.split(/\s+/).length > 4 || name.length < 2) return null;

  return name
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

const resolveSalutation = (text) => {
  const value = normalizeText(text);
  if (/\b(male|man|boy|sir|mr)\b/.test(value)) return 'Sir';
  if (/\b(female|woman|girl|maam|ma'am|mam|miss|mrs|ms)\b/.test(value)) return 'Maam';
  return null;
};

const sendVerifyPrompt = async (bot, chatId, reason) => {
  const text = reason
    ? `${reason}\n\nPlease verify your HMS account first by sharing your phone number.`
    : 'This feature requires HMS verification. Share your phone number to continue.';

  await bot.sendMessage(chatId, text, {
    reply_markup: {
      keyboard: [[{ text: 'Share my phone number', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
};

// --- static general info texts ---

const HMS_INFO = [
  'HMS (Hostel Management System) is the official platform for NIT hostel management.',
  '',
  'What HMS manages:',
  '- Student registration and room allotment',
  '- Hostel complaints and grievances',
  '- Notices and circulars from warden',
  '- Guest room booking',
  '- Hostel authority and admin management',
  '',
  'Roles in HMS:',
  '- Student: view complaints, notices, own profile',
  '- Hostel Authority: manage students, notices, complaints in their hostel',
  '- Super Admin: manage all hostels, rooms, courses, and accounts',
  '',
  'Access HMS at the official web portal or use this bot after verifying your account.'
].join('\n');

const HOW_TO_REGISTER = [
  'Student registration in HMS:',
  '',
  '1. The hostel authority creates a temporary account using your roll number and email',
  '2. You receive an email with your login credentials',
  '3. Log in to the HMS web portal and complete your profile',
  '   (personal details, photo, bank details)',
  '4. Submit your profile for hostel authority approval',
  '5. After approval your account is fully active',
  '',
  'For account issues, contact your hostel warden or the super admin.',
  '',
  'Video guide: https://youtu.be/ksmG2vyxjec?si=BJMuL7-4oifXPvAt',
  'HMS portal: https://nit-hostel-v2.vercel.app/'
].join('\n');

const HOW_TO_APPLY = [
  'Room allotment in HMS:',
  '',
  '- Room allotment is done by the Hostel Authority or Super Admin',
  '- Students cannot self-select a specific room',
  '- Contact your hostel warden to request room allotment',
  '- Bulk allotment is usually done at the start of each semester',
  '',
  'After verification, use "my details" to check your current room assignment.',
  '',
  'HMS portal: https://nit-hostel-v2.vercel.app/'
].join('\n');

const FEE_INFO = [
  'Hostel fee details:',
  '',
  '- Fee structure varies by hostel and room type',
  '- Fee payment is managed by the hostel administration',
  '- Contact your hostel warden or accounts section for exact amounts',
  '',
  'For specific fee queries, please contact your hostel authority directly.',
  '',
  'HMS portal: https://nit-hostel-v2.vercel.app/'
].join('\n');

const RULES_INFO = [
  'General hostel guidelines:',
  '',
  '- Follow gate timings set by your hostel authority',
  '- Maintain cleanliness in rooms and common areas',
  '- Guests must be registered through the HMS Guest Module',
  '- File complaints through HMS or this bot (verification required)',
  '- Notices from your warden appear in the Notices section',
  '',
  'For hostel-specific rules, contact your hostel warden.',
  '',
  'HMS portal: https://nit-hostel-v2.vercel.app/'
].join('\n');

const PUBLIC_CAPABILITIES = [
  'What I can do without login:',
  '- what is hms       → about the HMS system',
  '- hostel list       → list of all hostels',
  '- how to register   → student registration steps',
  '- how to apply      → room allotment process',
  '- hostel fee        → fee info',
  '- hostel rules      → general guidelines',
  '',
  'To access HMS features, verify your account:',
  'Say "verify" or use /verify',
  '',
  'HMS portal: https://nit-hostel-v2.vercel.app/'
].join('\n');

const ROLE_CAPABILITIES = {
  Student: [
    'Your HMS features (Student):',
    '',
    '- show complaints  → your hostel complaints',
    '- show notices     → your hostel notices',
    '- mess menu        → this week\'s mess menu',
    '- my details       → your profile, room and course info',
    '- who am i         → your verified account',
    '- logout           → remove verification'
  ].join('\n'),

  'Hostel-Authority': (hostelNo) => [
    `Your HMS features (Hostel Authority — Hostel ${hostelNo}):`,
    '',
    '- show complaints        → complaints in your hostel',
    '- show notices           → notices for your hostel',
    '- show rooms             → all rooms in your hostel',
    '- room [no]              → details & students in a specific room',
    '- vacant rooms           → fully vacant rooms in your hostel',
    '- partially filled rooms → rooms with available seats',
    '- show applications      → applications sent to you',
    '- student [rollno]       → any student in your hostel',
    '- upload notice          → post a notice for your hostel',
    '- who am i               → your verified account',
    '- logout                 → remove verification'
  ].join('\n'),

  SuperAdmin: [
    'Your HMS features (Super Admin):',
    '',
    '- show complaints        → all complaints across hostels',
    '- show notices           → all notices',
    '- show applications      → all applications',
    '- show rooms             → rooms in a hostel (will ask hostel no)',
    '- room [no]              → specific room (will ask hostel no)',
    '- vacant rooms           → vacant rooms (will ask hostel no)',
    '- partially filled rooms → rooms with available seats (will ask hostel no)',
    '- student [rollno]       → any student details',
    '- upload notice          → post global or hostel notice',
    '- who am i               → your verified account',
    '- logout                 → remove verification'
  ].join('\n')
};

const getCapabilitiesForSession = (session) => {
  if (!session) return PUBLIC_CAPABILITIES;
  const cap = ROLE_CAPABILITIES[session.role];
  if (!cap) return PUBLIC_CAPABILITIES;
  return typeof cap === 'function' ? cap(session.hostelNo) : cap;
};

const getRoleWelcome = (hmsUser) => {
  const lines = [
    'Verification successful!',
    `Welcome, ${hmsUser.name}.`,
    ''
  ];

  if (hmsUser.role === 'Student') {
    lines.push(
      'You are logged in as Student.',
      '',
      'What you can do:',
      '- show complaints  → your hostel complaints',
      '- show notices     → your hostel notices',
      '- my details       → your profile and room info'
    );
  } else if (hmsUser.role === 'Hostel-Authority') {
    lines.push(
      `You are logged in as Hostel Authority (Hostel ${hmsUser.hostelNo}).`,
      '',
      'What you can do:',
      '- show complaints        → complaints in your hostel',
      '- show notices           → notices for your hostel',
      '- show rooms             → all rooms in your hostel',
      '- room [no]              → specific room details & students',
      '- vacant rooms           → fully vacant rooms',
      '- partially filled rooms → rooms with available seats',
      '- show applications      → applications sent to you',
      '- student [rollno]       → student details in your hostel',
      '- upload notice          → post a notice for your hostel'
    );
  } else if (hmsUser.role === 'SuperAdmin') {
    lines.push(
      'You are logged in as Super Admin.',
      '',
      'What you can do:',
      '- show complaints        → all complaints across hostels',
      '- show notices           → all notices',
      '- show applications      → all applications',
      '- show rooms             → rooms in a hostel (bot will ask hostel no)',
      '- vacant rooms           → vacant rooms (bot will ask hostel no)',
      '- student [rollno]       → any student details',
      '- upload notice          → post global or hostel notice'
    );
  }

  lines.push('', 'Just type naturally or use /help to see all commands.');
  return lines.join('\n');
};

// --- intent detection ---

const getNaturalIntent = (text) => {
  const msg = normalizeText(text);
  const rollMatch = msg.match(/\b(?:student|roll|roll no|roll number)\s*#?\s*(\d{1,10})\b/);
  const roomMatch = msg.match(/\broom\s*(?:no|number|#)?\s*(\d{1,5})\b/);

  if (['verify', 'login', 'connect', 'authenticate'].some((w) => msg.includes(w))) {
    return { type: 'verify', requiresAuth: false };
  }

  if (
    msg.includes('what is hms') ||
    msg.includes('about hms') ||
    msg.includes('hostel management system') ||
    msg.includes('what does hms do') ||
    msg.includes('hms system') ||
    msg.includes('tell me about hms')
  ) {
    return { type: 'hms_info', requiresAuth: false };
  }

  if (
    msg.includes('hostel list') ||
    msg.includes('list of hostel') ||
    msg.includes('which hostel') ||
    msg.includes('hostel number') ||
    msg.includes('hostel name') ||
    msg.includes('all hostel') ||
    msg.includes('available hostel') ||
    msg.includes('how many hostel')
  ) {
    return { type: 'hostel_list', requiresAuth: false };
  }

  if (
    msg.includes('how to register') ||
    msg.includes('registration process') ||
    msg.includes('student registration') ||
    msg.includes('new student') ||
    msg.includes('how to create account') ||
    msg.includes('sign up') ||
    msg.includes('create account')
  ) {
    return { type: 'how_to_register', requiresAuth: false };
  }

  if (
    msg.includes('how to apply') ||
    msg.includes('apply for hostel') ||
    msg.includes('hostel application') ||
    msg.includes('room allot') ||
    msg.includes('get room') ||
    msg.includes('room allocation')
  ) {
    return { type: 'how_to_apply', requiresAuth: false };
  }

  if (
    msg.includes('show application') ||
    msg.includes('view application') ||
    msg.includes('pending application') ||
    msg.includes('application list') ||
    msg.includes('my application') ||
    msg.includes('all application') ||
    (msg.includes('application') && (msg.includes('status') || msg.includes('check')))
  ) {
    return { type: 'applications', requiresAuth: true };
  }

  if (
    msg.includes('partially') ||
    msg.includes('partial room') ||
    msg.includes('partially filled') ||
    msg.includes('partially empty') ||
    msg.includes('partially occupied') ||
    msg.includes('available room') ||
    msg.includes('available seat') ||
    msg.includes('room available')
  ) {
    return { type: 'room_vacancy', vacancyType: 'partial', requiresAuth: true };
  }

  if (
    msg.includes('vacant room') ||
    msg.includes('empty room') ||
    msg.includes('khali room') ||
    msg.includes('unoccupied room') ||
    msg.includes('free room') ||
    (msg.includes('room') && msg.includes('vacant')) ||
    (msg.includes('room') && msg.includes('empty')) ||
    (msg.includes('room') && msg.includes('khali'))
  ) {
    return { type: 'room_vacancy', vacancyType: 'vacant', requiresAuth: true };
  }

  if (
    roomMatch ||
    msg.includes('show room') ||
    msg.includes('room list') ||
    msg.includes('all room') ||
    msg.includes('hostel room') ||
    msg.includes('room detail') ||
    msg.includes('room info') ||
    (msg.includes('room') && (msg.includes('show') || msg.includes('view') || msg.includes('list')))
  ) {
    return { type: 'room_info', roomNo: roomMatch?.[1] || null, requiresAuth: true };
  }

  if (
    msg.includes('hostel fee') ||
    msg.includes('fee structure') ||
    msg.includes('hostel charge') ||
    msg.includes('hostel cost') ||
    msg.includes('hostel rent') ||
    msg.includes('how much fee')
  ) {
    return { type: 'fee_info', requiresAuth: false };
  }

  if (
    msg.includes('hostel rule') ||
    msg.includes('hostel regulation') ||
    msg.includes('hostel guideline') ||
    msg.includes('hostel policy') ||
    msg.includes('hostel timing') ||
    msg.includes('curfew') ||
    msg.includes('gate time')
  ) {
    return { type: 'rules_info', requiresAuth: false };
  }

  if (
    msg.includes('mess menu') ||
    msg.includes('mess food') ||
    msg.includes('today mess') ||
    msg.includes('hostel food') ||
    msg.includes('week menu') ||
    msg.includes('weekly menu') ||
    msg.includes('canteen menu') ||
    (msg.includes('mess') && (msg.includes('what') || msg.includes('show') || msg.includes('today') || msg.includes('menu')))
  ) {
    return { type: 'mess_menu', requiresAuth: true };
  }

  if (
    msg.includes('what can you do') ||
    msg.includes('features') ||
    msg.includes('commands') ||
    msg.includes('menu') ||
    msg.includes('help me') ||
    msg.includes('capabilities')
  ) {
    return { type: 'capabilities', requiresAuth: false };
  }

  if (
    msg.includes('complaint') ||
    msg.includes('show issues') ||
    msg.includes('view issues')
  ) {
    return { type: 'complaints', requiresAuth: true };
  }

  if (
    msg.includes('upload notice') ||
    msg.includes('post notice') ||
    msg.includes('send notice') ||
    msg.includes('create notice') ||
    msg.includes('add notice')
  ) {
    return { type: 'notice_upload', requiresAuth: true };
  }

  if (
    msg.includes('notice') ||
    msg.includes('circular') ||
    msg.includes('announcement')
  ) {
    return { type: 'notices', requiresAuth: true };
  }

  if (
    rollMatch ||
    msg.includes('student details') ||
    msg.includes('student info') ||
    msg.includes('my details') ||
    msg.includes('my info')
  ) {
    return { type: 'student_details', rollNo: rollMatch?.[1] || null, requiresAuth: true };
  }

  if (
    msg.includes('who am i') ||
    msg.includes('my account') ||
    msg.includes('my profile') ||
    msg.includes('account details')
  ) {
    return { type: 'me', requiresAuth: true };
  }

  if (
    msg.includes('logout') ||
    msg.includes('disconnect') ||
    msg.includes('log out') ||
    msg.includes('log me out')
  ) {
    return { type: 'logout', requiresAuth: true };
  }

  return null;
};

// --- formatters ---

const formatComplaints = (complaints) => {
  const body = complaints.length
    ? complaints.map((c) => [
        `#${c.complaintId} - ${c.subject || 'No subject'}`,
        `Status: ${c.status || 'N/A'}`,
        `Tag: ${c.tag || 'N/A'}`,
        `Description: ${c.description || 'N/A'}`
      ].join('\n')).join('\n\n')
    : 'No complaints found.';

  return `${body}\n\nHow to file a complaint: https://youtu.be/MzM_9pzfsuM?si=KIbWjGVzYTqXYZqv`;
};

const formatNotices = (notices) => {
  const body = notices.length
    ? notices.map((n, i) => [
        `${i + 1}. ${n.title || 'Untitled notice'}`,
        n.description ? `Description: ${n.description}` : null,
        `Audience: ${n.isGlobal ? 'All hostels' : `Hostel ${n.hostelNo}`}`,
        n.url ? `File: ${n.url}` : null
      ].filter(Boolean).join('\n')).join('\n\n')
    : 'No notices found.';

  return `${body}\n\nAbout notices & announcements: https://youtu.be/0jilj6A0xwM?si=nAK9Jp9Xh5yBEGBU`;
};

const formatStudentDetails = ({ student, profile, room, course }) => {
  const na = 'N/A';
  const name = `${student.firstName || ''} ${student.lastName || ''}`.trim() || na;

  const lines = [
    '--- Student Details ---',
    `Name       : ${name}`,
    `Roll No    : ${student.rollNo}`,
    `Email      : ${student.email || na}`,
    `Year       : ${student.year || na}`,
    `Hostel No  : ${student.hostelNo || na}`,
    `Room No    : ${room?.roomNo || na}`,
  ];

  if (course) {
    lines.push('', '--- Course ---');
    lines.push(`Course     : ${course.courseName || na}`);
    lines.push(`Department : ${course.department || na}`);
    if (course.specialization) lines.push(`Specialization: ${course.specialization}`);
    lines.push(`Duration   : ${course.courseDuration ? `${course.courseDuration} years` : na}`);
  }

  if (profile) {
    lines.push('', '--- Personal ---');
    if (profile.gender)      lines.push(`Gender     : ${profile.gender}`);
    if (profile.dob)         lines.push(`DOB        : ${profile.dob}`);
    if (profile.bloodGroup)  lines.push(`Blood Group: ${profile.bloodGroup}`);
    if (profile.identificationMark) lines.push(`ID Mark    : ${profile.identificationMark}`);

    lines.push('', '--- Contact ---');
    lines.push(`Mobile     : ${profile.contactNumber || na}`);
    if (profile.secondaryContact) lines.push(`Alt Mobile : ${profile.secondaryContact}`);
    if (profile.phoneNumber)      lines.push(`Phone      : ${profile.phoneNumber}`);
    if (profile.pEmail)           lines.push(`Parent Email: ${profile.pEmail}`);

    const addressParts = [profile.subAddress, profile.city, profile.state, profile.pinCode].filter(Boolean);
    if (addressParts.length) lines.push(`Address    : ${addressParts.join(', ')}`);

    lines.push('', '--- Family ---');
    if (profile.fatherName)       lines.push(`Father     : ${profile.fatherName}`);
    if (profile.fatherContact)    lines.push(`Father Ph  : ${profile.fatherContact}`);
    if (profile.fatherOccupation) lines.push(`Father Occ : ${profile.fatherOccupation}`);
    if (profile.motherName)       lines.push(`Mother     : ${profile.motherName}`);
    if (profile.motherContact)    lines.push(`Mother Ph  : ${profile.motherContact}`);
    if (profile.motherOccupation) lines.push(`Mother Occ : ${profile.motherOccupation}`);

    if (profile.localGuardian || profile.localGuardianContact) {
      lines.push('', '--- Local Guardian ---');
      if (profile.localGuardian)        lines.push(`Name       : ${profile.localGuardian}`);
      if (profile.localGuardianContact) lines.push(`Contact    : ${profile.localGuardianContact}`);
      if (profile.localGuardianAddress) lines.push(`Address    : ${profile.localGuardianAddress}`);
    }
  }

  return lines.join('\n');
};

const formatMessMenu = (menu, hostelNo) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const hasData = menu.some(d => d.breakfast || d.lunch || d.snacks || d.dinner);
  if (!hasData) return `No mess menu has been set for Hostel ${hostelNo} yet.`;

  const lines = [`Mess Menu — Hostel ${hostelNo}`, ''];
  for (const row of menu) {
    const isToday = row.day === today;
    lines.push(`${isToday ? '➤ ' : '  '}${row.day}${isToday ? ' (Today)' : ''}`);
    if (row.breakfast) lines.push(`  Breakfast : ${row.breakfast}`);
    if (row.lunch)     lines.push(`  Lunch     : ${row.lunch}`);
    if (row.snacks)    lines.push(`  Snacks    : ${row.snacks}`);
    if (row.dinner)    lines.push(`  Dinner    : ${row.dinner}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd();
};

const formatRooms = ({ rooms, students, hostelNo }, roomNo) => {
  if (roomNo && rooms.length > 0) {
    const r = rooms[0];
    const na = 'N/A';
    const lines = [
      `--- Room ${r.roomNo} | Hostel ${hostelNo} ---`,
      `Block      : ${r.block || na}`,
      `Floor      : ${r.floorNo || na}`,
      `Occupancy  : ${r.currentOccupancy || 0} / ${r.maxOccupancy || na}`,
      ''
    ];
    if (students.length) {
      lines.push('Students in this room:');
      students.forEach((s, i) => {
        const name = `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email;
        lines.push(`  ${i + 1}. ${name} (Roll: ${s.rollNo})`);
      });
    } else {
      lines.push('No students currently allocated to this room.');
    }
    return lines.join('\n');
  }

  const lines = [`--- Rooms | Hostel ${hostelNo} ---`, ''];
  rooms.forEach((r) => {
    lines.push(
      `Room ${r.roomNo}${r.block ? ` (Block ${r.block})` : ''} | Floor: ${r.floorNo || 'N/A'} | Occupancy: ${r.currentOccupancy || 0}/${r.maxOccupancy || '?'}`
    );
  });
  if (rooms.length === 30) lines.push('\n(Showing first 30. Type "room [no]" to see a specific room.)');
  return lines.join('\n');
};

const formatVacantRooms = ({ rooms, hostelNo, type }) => {
  const label = type === 'vacant' ? 'Vacant Rooms' : type === 'partial' ? 'Partially Filled Rooms' : 'Available Rooms';

  if (!rooms.length) {
    return `No ${label.toLowerCase()} found in Hostel ${hostelNo}.`;
  }

  const lines = [`--- ${label} | Hostel ${hostelNo} ---`, `Total: ${rooms.length}`, ''];
  rooms.forEach((r) => {
    const curr = Number(r.currentOccupancy) || 0;
    const max = Number(r.maxOccupancy) || 0;
    const free = max - curr;
    lines.push(
      `Room ${r.roomNo}${r.block ? ` (Block ${r.block})` : ''} | Floor: ${r.floorNo || 'N/A'} | Occupied: ${curr}/${max} | Free seats: ${free}`
    );
  });
  return lines.join('\n');
};

const formatApplications = (applications, role) => {
  if (!applications.length) {
    return role === 'SuperAdmin'
      ? 'No applications found in the system.'
      : 'No applications sent to you yet.';
  }

  const body = applications.map((a) => [
    `#${a.applicationId} — ${a.title || 'Untitled'}`,
    `Status     : ${a.status || 'pending'}`,
    `Tag        : ${a.tag || 'N/A'}`,
    `By         : ${a.createdBy} (${a.createdByRole || 'N/A'})`,
    a.adminComment ? `Admin Note : ${a.adminComment}` : null,
    a.superAdminComment ? `SA Note    : ${a.superAdminComment}` : null
  ].filter(Boolean).join('\n')).join('\n\n');

  return `--- Applications ---\n\n${body}`;
};

const formatHostels = (hostels) => {
  if (!hostels.length) return 'No hostel data found.';

  return [
    'Hostels in HMS:',
    '',
    ...hostels.map((h) => `Hostel ${h.hostelNo}: ${h.hostelName || 'N/A'} (${h.type || 'N/A'})`)
  ].join('\n');
};

// --- memory flow ---

const handleHumanMemory = async (bot, message) => {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text;
  const conversation = getConversation(userId);

  if (!text || text.startsWith('/')) return false;

  if (conversation.pending === 'name') {
    const name = extractName(text);
    if (!name) {
      await bot.sendMessage(chatId, 'Please tell me your name in text. Example: "My name is Sourav".');
      return true;
    }
    updateConversation(userId, { name, pending: 'salutation' });
    await bot.sendMessage(chatId, `Nice to meet you, ${name}. How should I address you: Sir or Maam?`);
    return true;
  }

  if (conversation.pending === 'salutation') {
    const salutation = resolveSalutation(text);
    if (!salutation) {
      await bot.sendMessage(chatId, 'Please reply with "Sir" or "Maam".');
      return true;
    }
    const updated = updateConversation(userId, { salutation, pending: null });
    await bot.sendMessage(
      chatId,
      `Done, ${updated.salutation}. I will remember that.\n\nYou can ask me about HMS info, hostels, registration, or use /verify to access HMS features.`
    );
    return true;
  }

  if (isGreeting(text)) {
    const name = conversation.name ? ` ${conversation.name}` : '';
    await bot.sendMessage(
      chatId,
      `Hi${name}! I am agentHms, your HMS assistant.\n\nYou can ask me about HMS info, hostel list, registration, or use /verify to access HMS features.`
    );
    return true;
  }

  return false;
};

// --- pending notice flow ---

const handlePendingNotice = async (bot, message, pending) => {
  const chatId = message.chat.id;
  const userId = message.from.id;

  if (pending.type === 'student:rollno') {
    const input = message.text?.trim();
    if (!input || !/^\d+$/.test(input)) {
      await bot.sendMessage(chatId, 'Please send a valid roll number (digits only).');
      return true;
    }
    pendingActions.delete(userId);
    const session = getSession(userId);
    try {
      await bot.sendChatAction(chatId, 'typing');
      const details = await getStudentDetailsForSession(session, input);
      await sendStudentDetails(bot, chatId, details);
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  if (pending.type === 'room:hostelno') {
    const input = message.text?.trim();
    if (!input || !/^\d+$/.test(input)) {
      await bot.sendMessage(chatId, 'Please send a valid hostel number (digits only).');
      return true;
    }
    const hostelNo = input;
    const session = getSession(userId);

    if (pending.context === 'room_vacancy') {
      pendingActions.delete(userId);
      try {
        await bot.sendChatAction(chatId, 'typing');
        const data = await getVacantRoomsForSession(session, { hostelNo, type: pending.vacancyType });
        await bot.sendMessage(chatId, formatVacantRooms(data));
      } catch (error) {
        await bot.sendMessage(chatId, error.message);
      }
      return true;
    }

    // context === 'room_info'
    if (pending.roomNo) {
      // room number was already known, fetch directly
      pendingActions.delete(userId);
      try {
        await bot.sendChatAction(chatId, 'typing');
        const data = await getRoomDetailsForSession(session, { hostelNo, roomNo: pending.roomNo });
        await bot.sendMessage(chatId, formatRooms(data, pending.roomNo));
      } catch (error) {
        await bot.sendMessage(chatId, error.message);
      }
    } else {
      // ask for room number
      pendingActions.set(userId, { type: 'room:roomno', hostelNo });
      await bot.sendMessage(chatId, `Hostel ${hostelNo} selected.\nSend room number, or send "all" to see all rooms.`);
    }
    return true;
  }

  if (pending.type === 'room:roomno') {
    const input = message.text?.trim().toLowerCase();
    if (!input) {
      await bot.sendMessage(chatId, 'Please send a room number or "all".');
      return true;
    }
    pendingActions.delete(userId);
    const session = getSession(userId);
    const roomNo = input === 'all' ? null : input;
    try {
      await bot.sendChatAction(chatId, 'typing');
      const data = await getRoomDetailsForSession(session, { hostelNo: pending.hostelNo, roomNo });
      await bot.sendMessage(chatId, formatRooms(data, roomNo));
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  if (pending.type === 'notice:title') {
    if (!message.text?.trim()) {
      await bot.sendMessage(chatId, 'Please send the notice title as text.');
      return true;
    }
    pendingActions.set(userId, { type: 'notice:description', title: message.text.trim() });
    await bot.sendMessage(chatId, 'Send notice description, or send "-" to skip.');
    return true;
  }

  if (pending.type === 'notice:description') {
    if (!message.text?.trim()) {
      await bot.sendMessage(chatId, 'Please send the notice description as text, or send "-" to skip.');
      return true;
    }
    pendingActions.set(userId, {
      type: 'notice:file',
      title: pending.title,
      description: message.text.trim() === '-' ? '' : message.text.trim()
    });
    await bot.sendMessage(chatId, 'Now send the notice file as PDF/JPG/PNG.');
    return true;
  }

  if (pending.type === 'notice:file') {
    const session = getSession(userId);
    try {
      await bot.sendChatAction(chatId, 'upload_document');
      const notice = await createNoticeFromTelegramFile({
        bot,
        message,
        session,
        title: pending.title,
        description: pending.description
      });
      pendingActions.delete(userId);
      await bot.sendMessage(chatId, `Notice uploaded successfully.\nTitle: ${notice.title}`);
    } catch (error) {
      logger.error(`Notice upload failed for ${chatId}: ${error.message}`);
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  return false;
};

// --- contact verification ---

const handleContactVerification = async (bot, message) => {
  const chatId = message.chat.id;
  const contact = message.contact;

  if (contact.user_id !== message.from.id) {
    await bot.sendMessage(chatId, 'Please share your own Telegram contact using the verify button.');
    return;
  }

  try {
    await bot.sendChatAction(chatId, 'typing');
    const hmsUser = await verifyHmsUserByPhone(contact.phone_number);

    if (!hmsUser) {
      await bot.sendMessage(
        chatId,
        'This phone number was not found in an active HMS account.\n\nMake sure your mobile number is saved in your HMS profile.',
        { reply_markup: { remove_keyboard: true } }
      );
      return;
    }

    saveSession(message.from.id, hmsUser);

    await bot.sendMessage(
      chatId,
      getRoleWelcome(hmsUser),
      { reply_markup: { remove_keyboard: true } }
    );
  } catch (error) {
    logger.error(`Verification failed for ${chatId}: ${error.message}`);
    await bot.sendMessage(chatId, 'Verification failed. Please try again later.');
  }
};

// --- exported command handlers ---

exports.handleComplaintsCommand = async (bot, message) => {
  const chatId = message.chat.id;
  const session = getSession(message.from.id);

  if (!session) {
    await sendVerifyPrompt(bot, chatId, 'Viewing complaints requires an HMS account.');
    return;
  }

  try {
    await bot.sendChatAction(chatId, 'typing');
    const complaints = await getComplaintsForSession(session);
    await bot.sendMessage(chatId, formatComplaints(complaints));
  } catch (error) {
    logger.error(`Failed to fetch complaints for ${chatId}: ${error.message}`);
    await bot.sendMessage(chatId, 'Could not fetch complaints right now.');
  }
};

exports.handleNoticesCommand = async (bot, message) => {
  const chatId = message.chat.id;
  const session = getSession(message.from.id);

  if (!session) {
    await sendVerifyPrompt(bot, chatId, 'Viewing notices requires an HMS account.');
    return;
  }

  try {
    await bot.sendChatAction(chatId, 'typing');
    const notices = await getNoticesForSession(session);
    await bot.sendMessage(chatId, formatNotices(notices), { disable_web_page_preview: true });
  } catch (error) {
    logger.error(`Failed to fetch notices for ${chatId}: ${error.message}`);
    await bot.sendMessage(chatId, 'Could not fetch notices right now.');
  }
};

const sendStudentDetails = async (bot, chatId, details) => {
  const text = formatStudentDetails(details);
  if (details.profile?.photoLink) {
    try {
      await bot.sendPhoto(chatId, details.profile.photoLink, { caption: text });
      return;
    } catch {
      // photo send failed, fall back to text only
    }
  }
  await bot.sendMessage(chatId, text);
};

exports.handleStudentDetailsCommand = async (bot, message, rollNo = null) => {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const session = getSession(userId);

  if (!session) {
    await sendVerifyPrompt(bot, chatId, 'Viewing student details requires an HMS account.');
    return;
  }

  // Students always see their own details — no roll number needed
  // HA and SuperAdmin must provide one
  if (!rollNo && session.role !== 'Student') {
    pendingActions.set(userId, { type: 'student:rollno' });
    await bot.sendMessage(chatId, 'Please send the student roll number.');
    return;
  }

  try {
    await bot.sendChatAction(chatId, 'typing');
    const details = await getStudentDetailsForSession(session, rollNo);
    await sendStudentDetails(bot, chatId, details);
  } catch (error) {
    await bot.sendMessage(chatId, error.message);
  }
};

exports.handleNoticeCommand = async (bot, message) => {
  const chatId = message.chat.id;
  const session = getSession(message.from.id);

  if (!session) {
    await sendVerifyPrompt(bot, chatId, 'Uploading notices requires an HMS account.');
    return;
  }

  if (!['Hostel-Authority', 'SuperAdmin'].includes(session.role)) {
    await bot.sendMessage(chatId, 'Only Hostel Authority or Super Admin accounts can upload notices.');
    return;
  }

  pendingActions.set(message.from.id, { type: 'notice:title' });
  await bot.sendMessage(chatId, 'Send notice title.');
};

// --- intent handler ---

const handleIntent = async (bot, message, intent) => {
  const chatId = message.chat.id;

  if (intent.requiresAuth) {
    const session = getSession(message.from.id);
    if (!session) {
      const reasonMap = {
        complaints: 'Viewing complaints requires HMS verification.',
        notices: 'Viewing notices requires HMS verification.',
        notice_upload: 'Uploading notices requires HMS verification.',
        student_details: 'Viewing student details requires HMS verification.',
        me: 'Viewing your profile requires HMS verification.',
        logout: 'You are not verified yet.'
      };
      await sendVerifyPrompt(bot, chatId, reasonMap[intent.type] || '');
      return true;
    }
  }

  if (intent.type === 'verify') {
    const session = getSession(message.from.id);
    if (session) {
      await bot.sendMessage(
        chatId,
        `You are already verified as ${session.name} (${session.role}).\n\n${getCapabilitiesForSession(session)}`
      );
      return true;
    }
    await bot.sendMessage(chatId, 'Share your Telegram phone number to verify your HMS account.', {
      reply_markup: {
        keyboard: [[{ text: 'Share my phone number', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return true;
  }

  if (intent.type === 'hms_info') {
    await bot.sendMessage(chatId, HMS_INFO);
    return true;
  }

  if (intent.type === 'hostel_list') {
    try {
      await bot.sendChatAction(chatId, 'typing');
      const hostels = await getHostelsList();
      await bot.sendMessage(chatId, formatHostels(hostels));
    } catch {
      await bot.sendMessage(chatId, 'Could not fetch hostel list right now. Please try again later.');
    }
    return true;
  }

  if (intent.type === 'how_to_register') {
    await bot.sendMessage(chatId, HOW_TO_REGISTER);
    return true;
  }

  if (intent.type === 'how_to_apply') {
    await bot.sendMessage(chatId, HOW_TO_APPLY);
    return true;
  }

  if (intent.type === 'fee_info') {
    await bot.sendMessage(chatId, FEE_INFO);
    return true;
  }

  if (intent.type === 'rules_info') {
    await bot.sendMessage(chatId, RULES_INFO);
    return true;
  }

  if (intent.type === 'capabilities') {
    const session = getSession(message.from.id);
    await bot.sendMessage(chatId, getCapabilitiesForSession(session));
    return true;
  }

  if (intent.type === 'mess_menu') {
    const session = getSession(message.from.id);
    try {
      await bot.sendChatAction(chatId, 'typing');
      const menu = await getMessMenuForSession(session);
      await bot.sendMessage(chatId, formatMessMenu(menu, session.hostelNo));
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  if (intent.type === 'complaints') {
    await exports.handleComplaintsCommand(bot, message);
    return true;
  }

  if (intent.type === 'notices') {
    await exports.handleNoticesCommand(bot, message);
    return true;
  }

  if (intent.type === 'notice_upload') {
    await exports.handleNoticeCommand(bot, message);
    return true;
  }

  if (intent.type === 'room_info') {
    const session = getSession(message.from.id);
    if (!['Hostel-Authority', 'SuperAdmin'].includes(session?.role)) {
      await bot.sendMessage(chatId, 'Only Hostel Authority or Super Admin can view room details.');
      return true;
    }
    if (session.role === 'SuperAdmin') {
      const prompt = intent.roomNo
        ? `Please send the hostel number to look up Room ${intent.roomNo}.`
        : 'Please send the hostel number.';
      pendingActions.set(message.from.id, { type: 'room:hostelno', context: 'room_info', roomNo: intent.roomNo || null });
      await bot.sendMessage(chatId, prompt);
      return true;
    }
    try {
      await bot.sendChatAction(chatId, 'typing');
      const data = await getRoomDetailsForSession(session, { hostelNo: session.hostelNo, roomNo: intent.roomNo || null });
      await bot.sendMessage(chatId, formatRooms(data, intent.roomNo));
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  if (intent.type === 'room_vacancy') {
    const session = getSession(message.from.id);
    if (!['Hostel-Authority', 'SuperAdmin'].includes(session?.role)) {
      await bot.sendMessage(chatId, 'Only Hostel Authority or Super Admin can view room availability.');
      return true;
    }
    if (session.role === 'SuperAdmin') {
      pendingActions.set(message.from.id, { type: 'room:hostelno', context: 'room_vacancy', vacancyType: intent.vacancyType });
      await bot.sendMessage(chatId, 'Please send the hostel number.');
      return true;
    }
    try {
      await bot.sendChatAction(chatId, 'typing');
      const data = await getVacantRoomsForSession(session, { hostelNo: session.hostelNo, type: intent.vacancyType });
      await bot.sendMessage(chatId, formatVacantRooms(data));
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  if (intent.type === 'applications') {
    const session = getSession(message.from.id);
    if (!['Hostel-Authority', 'SuperAdmin'].includes(session?.role)) {
      await bot.sendMessage(chatId, 'Only Hostel Authority or Super Admin can view applications.');
      return true;
    }
    try {
      await bot.sendChatAction(chatId, 'typing');
      const apps = await getApplicationsForSession(session);
      await bot.sendMessage(chatId, formatApplications(apps, session.role));
    } catch (error) {
      await bot.sendMessage(chatId, error.message);
    }
    return true;
  }

  if (intent.type === 'student_details') {
    await exports.handleStudentDetailsCommand(bot, message, intent.rollNo);
    return true;
  }

  if (intent.type === 'me') {
    const session = getSession(message.from.id);
    await bot.sendMessage(
      chatId,
      [
        'Your verified HMS account:',
        `Name: ${session.name || 'N/A'}`,
        `Role: ${session.role}`,
        `Email: ${session.email || 'N/A'}`,
        session.rollNo ? `Roll No: ${session.rollNo}` : null,
        session.hostelNo ? `Hostel No: ${session.hostelNo}` : null
      ].filter(Boolean).join('\n')
    );
    return true;
  }

  if (intent.type === 'logout') {
    clearSession(message.from.id);
    await bot.sendMessage(chatId, 'You are logged out.\n\nUse /verify or say "verify" to connect again.', {
      reply_markup: { remove_keyboard: true }
    });
    return true;
  }

  return false;
};

// --- main message handler ---

exports.handleTextMessage = async (bot, message) => {
  const chatId = message.chat.id;
  const text = message.text;
  const username = message.from?.username || message.from?.first_name || 'unknown_user';

  if (message.contact) {
    await handleContactVerification(bot, message);
    return;
  }

  const pending = pendingActions.get(message.from.id);
  if (pending && (message.text || message.document || message.photo)) {
    const handled = await handlePendingNotice(bot, message, pending);
    if (handled) return;
  }

  if (!text) return;

  const memoryHandled = await handleHumanMemory(bot, message);
  if (memoryHandled) return;

  if (text.startsWith('/')) {
    logger.info(`Ignored command "${text}" from ${username} (${chatId})`);
    return;
  }

  activeChats.add(chatId);
  logger.info(`Message from ${username} (${chatId}): ${text}`);

  try {
    const intent = getNaturalIntent(text);

    if (intent) {
      const handled = await handleIntent(bot, message, intent);
      if (handled) return;
    }

    const conversation = getConversation(message.from.id);
    const reply = getReplyForMessage(text, { address: buildAddress(conversation) });

    await bot.sendChatAction(chatId, 'typing');
    await bot.sendMessage(chatId, reply);

    logger.info(`Reply sent to ${username} (${chatId})`);
  } catch (error) {
    logger.error(`Failed to reply to chat ${chatId}: ${error.message}`);
    try {
      await bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again later.');
    } catch (sendError) {
      logger.error(`Failed to send error message to chat ${chatId}: ${sendError.message}`);
    }
  }
};

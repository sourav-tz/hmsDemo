const { logger } = require('../utils/logger');
const { clearSession, getSession } = require('../utils/sessionStore');

exports.handleStartCommand = async (bot, message) => {
  const chatId = message.chat.id;
  const firstName = message.from?.first_name || 'there';

  logger.info(`/start from ${firstName} (${chatId})`);

  try {
    await bot.sendChatAction(chatId, 'typing');
    await bot.sendMessage(
      chatId,
      [
        `Hi ${firstName}! I am agentHms, your HMS Telegram assistant.`,
        '',
        'I can help you without any login:',
        '- What is HMS',
        '- Hostel list',
        '- Registration and application process',
        '- Fee info and hostel rules',
        '',
        'For HMS account features (complaints, notices, student details):',
        'Use /verify to connect your phone number to your HMS account.',
        '',
        'Ask me anything or type /help to see all options.'
      ].join('\n')
    );
  } catch (error) {
    logger.error(`Failed to handle /start for chat ${chatId}: ${error.message}`);
  }
};

exports.handleHelpCommand = async (bot, message) => {
  const chatId = message.chat.id;
  const firstName = message.from?.first_name || 'user';

  logger.info(`/help from ${firstName} (${chatId})`);

  try {
    await bot.sendChatAction(chatId, 'typing');
    await bot.sendMessage(
      chatId,
      [
        'Commands:',
        '/start   - Welcome message',
        '/help    - Show this help',
        '/verify  - Connect your phone to HMS account',
        '/me      - Show your verified account',
        '/complaints - Show complaints',
        '/notices    - Show notices',
        '/notice     - Upload a notice (Hostel Authority only)',
        '/student 123 - Show student details',
        '/logout  - Remove verification',
        '',
        'No login needed (just ask naturally):',
        '"what is hms"',
        '"hostel list"',
        '"how to register"',
        '"how to apply for hostel"',
        '"hostel fee"',
        '"hostel rules"',
        '"what can you do"',
        '',
        'Login required (verify first):',
        '"show complaints"',
        '"show notices"',
        '"my details"',
        '"student 123 details"',
        '"upload notice"'
      ].join('\n')
    );
  } catch (error) {
    logger.error(`Failed to handle /help for chat ${chatId}: ${error.message}`);
  }
};

exports.handleVerifyCommand = async (bot, message) => {
  const chatId = message.chat.id;

  await bot.sendMessage(chatId, 'Tap the button below and share your own Telegram phone number.', {
    reply_markup: {
      keyboard: [[{ text: 'Share my phone number', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
};

exports.handleMeCommand = async (bot, message) => {
  const chatId = message.chat.id;
  const session = getSession(message.from.id);

  if (!session) {
    await bot.sendMessage(chatId, 'You are not verified yet. Use /verify to connect your HMS account.', {
      reply_markup: {
        keyboard: [[{ text: 'Share my phone number', request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  const roleLabel = {
    Student: 'Student',
    'Hostel-Authority': 'Hostel Authority',
    SuperAdmin: 'Super Admin'
  }[session.role] || session.role;

  const lines = [
    'Your verified HMS account:',
    `Name    : ${session.name || 'N/A'}`,
    `Role    : ${roleLabel}`,
    `Email   : ${session.email || 'N/A'}`
  ];

  if (session.rollNo)  lines.push(`Roll No : ${session.rollNo}`);
  if (session.hostelNo) lines.push(`Hostel  : ${session.hostelNo}`);
  if (session.verifiedAt) lines.push(`Since   : ${new Date(session.verifiedAt).toLocaleString()}`);

  await bot.sendMessage(chatId, lines.join('\n'));
};

exports.handleLogoutCommand = async (bot, message) => {
  clearSession(message.from.id);
  await bot.sendMessage(message.chat.id, '✅ You are logged out.\n\nUse /verify to login again.', {
    reply_markup: { remove_keyboard: true }
  });
};

const replies = {
  hello: 'Hi 👋',
  hi: 'Hi, I am here. You can ask me to show complaints, notices, or your HMS profile.',
  hey: 'Hey. Tell me what you want to check in HMS.',
  'hi hello': 'Hello. I can help with HMS complaints, notices, profile details, and notice upload.',
  bye: 'Goodbye 😄',
  'how are you': 'I am fine. How can I help with HMS today?',
  thanks: 'You are welcome.',
  thank: 'You are welcome.',
  'thank you': 'You are welcome.',
  ok: 'Okay.',
  help: 'You can ask: show complaints, show notices, my details, student 123 details, upload notice, or verify my account.'
};

const defaultReply = [
  'I can help with HMS tasks.',
  'Try: "what is hms", "hostel list", "how to register", "show complaints", "show notices", or "verify my account".',
  '',
  'HMS portal: https://nit-hostel-v2.vercel.app/'
].join('\n');

const normalizeMessage = (message) => message.trim().toLowerCase();

exports.getReplyForMessage = (message, context = {}) => {
  const keyword = normalizeMessage(message);
  const address = context.address ? ` ${context.address}` : '';

  if (/^(hi+|hello+|hey|hii|helo|helllo)\b/.test(keyword)) {
    return `Hi${address}, I am agentHms. I can help you with HMS complaints, notices, student details, and notice upload.`;
  }

  if (/\b(thanks|thank you|thank u|ty)\b/.test(keyword)) {
    return `You are welcome${address}.`;
  }

  if (/\b(good morning|good afternoon|good evening)\b/.test(keyword)) {
    return `Good day${address}. How can I help with HMS?`;
  }

  if (keyword === 'ok' || keyword === 'okay') {
    return `Okay${address}.`;
  }

  return replies[keyword] || `${defaultReply}${context.address ? `\n\nI am here, ${context.address}.` : ''}`;
};

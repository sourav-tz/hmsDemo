const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.cwd(), 'bot-data');
const storePath = path.join(dataDir, 'conversation-memory.json');

const ensureStore = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, '{}\n');
  }
};

const readStore = () => {
  ensureStore();

  try {
    return JSON.parse(fs.readFileSync(storePath, 'utf8'));
  } catch {
    return {};
  }
};

const writeStore = (store) => {
  ensureStore();
  fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`);
};

exports.getConversation = (telegramUserId) => {
  const store = readStore();
  return store[String(telegramUserId)] || {};
};

exports.updateConversation = (telegramUserId, updates) => {
  const store = readStore();
  const key = String(telegramUserId);

  store[key] = {
    ...(store[key] || {}),
    ...updates,
    updatedAt: new Date().toISOString()
  };

  writeStore(store);
  return store[key];
};

exports.getDisplayName = (conversation, fallback = 'there') => {
  return conversation.name || fallback;
};

exports.getSalutation = (conversation) => {
  if (conversation.salutation) {
    return conversation.salutation;
  }

  return '';
};

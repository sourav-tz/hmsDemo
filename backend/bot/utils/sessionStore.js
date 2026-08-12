const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(process.cwd(), 'bot-data');
const storePath = path.join(dataDir, 'telegram-sessions.json');

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

exports.getSession = (telegramUserId) => {
  const store = readStore();
  return store[String(telegramUserId)] || null;
};

exports.saveSession = (telegramUserId, session) => {
  const store = readStore();
  store[String(telegramUserId)] = {
    ...session,
    telegramUserId,
    verifiedAt: new Date().toISOString()
  };
  writeStore(store);
};

exports.clearSession = (telegramUserId) => {
  const store = readStore();
  delete store[String(telegramUserId)];
  writeStore(store);
};

exports.updateSession = (telegramUserId, updates) => {
  const existing = exports.getSession(telegramUserId) || {};
  exports.saveSession(telegramUserId, { ...existing, ...updates });
};

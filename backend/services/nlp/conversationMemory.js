// Simple in-memory store (per user)
const userContextMap = new Map();

// Save context
const setUserContext = (userId, context) => {
  userContextMap.set(userId, context);
};

// Get context
const getUserContext = (userId) => {
  return userContextMap.get(userId);
};

// Optional: clear context (use later if needed)
const clearUserContext = (userId) => {
  userContextMap.delete(userId);
};

module.exports = {
  setUserContext,
  getUserContext,
  clearUserContext
};
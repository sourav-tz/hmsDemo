const { adminNlpQuery } = require('../nlp/adminNlp.controller');

const guestChat = async (req, res) => {
  try {

    // 🔥 Simulate "no user"
    req.user = null;

    // reuse same controller
    return await adminNlpQuery(req, res);

  } catch (error) {
    console.error("Guest Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: "Guest chatbot failed"
    });
  }
};

module.exports = { guestChat };
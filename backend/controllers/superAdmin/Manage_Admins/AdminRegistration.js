// controllers/hostelAuthorityController.js

const db = require('../../../models/index');
const bcrypt = require('bcrypt');
const mailSender = require('../../../utils/mailSender');
const AdminRegistrationEmail = require('../../../MailTemplates/AdminRegistrationEmail');

/**
 * Registers a new Hostel Authority user and sends a confirmation email.
 * @route POST /api/hostel-authority/register
 * @body { email, name, roleType, mobile, password, hostelNo }
 */
const AdminRegistration = async (req, res) => {
  // start a transaction
  const transaction = await db.sequelize.transaction();

  try {
    const { email, name, roleType, mobile, password, hostelNo } = req.body;

    // check if user already exists
    const isExist = await db.users.findOne({ where: { email } });
    if (isExist) {
      await transaction.rollback();
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    // prepare payloads
    const userPayload = { email, password: securePassword, role: 'Hostel-Authority' };
    const authorityPayload = { email, name, roleType, mobile, hostelNo };

    // create records
    const newUser = await db.users.create(userPayload, { transaction, validate: true });
    await db.hostelauthoritys.create(authorityPayload, { transaction, validate: true });

    // commit transaction
    await transaction.commit();

    // send confirmation email (mail failures do not rollback DB)
    const subject = 'Hostel Authority Registration || NIT KURUKSHETRA';
    const emailBody = AdminRegistrationEmail(name, password, hostelNo);
    try {
      await mailSender(email, subject, emailBody);
    } catch (mailErr) {
      console.error('Email send error:', mailErr);
    }

    // respond success
    return res.status(201).json({
      success: 'Hostel-Authority registered successfully',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    // rollback on any error
    await transaction.rollback();
    console.error('Error in AdminRegistration:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = AdminRegistration;

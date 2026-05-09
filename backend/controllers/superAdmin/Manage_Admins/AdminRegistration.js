// const db = require('../../../models/index');
// const bcrypt = require('bcrypt');
// const mailSender = require('../../../utils/mailSender');
// const AdminRegistrationEmail = require('../../../MailTemplates/AdminRegistrationEmail');

// const AdminRegistration = async (req, res) => {
//   const { email, name, roleType, mobile, password, hostelNo } = req.body;

//   try {
//     // 1. Check if user already exists (no transaction yet)
//     const isExist = await db.users.findOne({ where: { email } });
//     if (isExist) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     console.log("works fine");

//     // 2. Start transaction only when needed
//     const transaction = await db.sequelize.transaction();
//     try {
//       // hash password
//       const salt = await bcrypt.genSalt(10);
//       const securePassword = await bcrypt.hash(password, salt);

//       // payloads
//       const userPayload = { email, password: securePassword, role: 'Hostel-Authority' };
//       const authorityPayload = { email, name, roleType, mobile, hostelNo };

//       // create records in transaction
//       const newUser = await db.users.create(userPayload, { transaction });
//       await db.hostelauthoritys.create(authorityPayload, { transaction });

//       // commit transaction
//       await transaction.commit();

//       // send confirmation email
//       const subject = 'Hostel Authority Registration || NIT KURUKSHETRA';
//       const emailBody = AdminRegistrationEmail(name, password, hostelNo);
//       try {
//         await mailSender(email, subject, emailBody);
//       } catch (mailErr) {
//         console.error('Email send error:', mailErr);
//       }

//       return res.status(201).json({
//         success: 'Hostel-Authority registered successfully',
//         user: { id: newUser.id, email: newUser.email }
//       });

//     } catch (error) {
//       await transaction.rollback();
//       console.error('Transaction error in AdminRegistration:', error);
//       return res.status(500).json({ error: error.message });
//     }

//   } catch (error) {
//     console.error('Error in AdminRegistration:', error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// module.exports = AdminRegistration;

// controllers/SuperAdmin/AdminRegistration.js


// controllers/SuperAdmin/AdminRegistration.js

const db = require('../../../models/index');
const bcrypt = require('bcrypt');
const mailSender = require('../../../utils/mailSender');
const AdminRegistrationEmail = require('../../../MailTemplates/AdminRegistrationEmail');

const AdminRegistration = async (req, res) => {
  const { email, name, roleType, mobile, password, hostelNo } = req.body;

  try {
    if (!/^[6-9]\d{9}$/.test(String(mobile || ''))) {
      return res.status(400).json({ message: 'A valid 10 digit mobile number is required' });
    }

    // Check if user already exists
    const isExist = await db.users.findOne({ where: { email } });
    if (isExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log("Admin registration started...");

    // Start transaction
    const transaction = await db.sequelize.transaction();
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(password, salt);

      // Payloads
      const userPayload = { email, password: securePassword, role: 'Hostel-Authority', mobile };
      const authorityPayload = { email, name, roleType, mobile, hostelNo };

      // Create both records
      const newUser = await db.users.create(userPayload, { transaction });
      const newAuthority = await db.hostelauthoritys.create(authorityPayload, { transaction });

      // Commit transaction
      await transaction.commit();

      // Send registration email
      const subject = 'Hostel Authority Registration || NIT KURUKSHETRA';
      const emailBody = AdminRegistrationEmail(name, password, hostelNo);
      try {
        await mailSender(email, subject, emailBody);
      } catch (mailErr) {
        console.error('Email send error:', mailErr);
      }

      // ✅ Include name and hostel number in response
      return res.status(201).json({
        success: true,
        message: 'Hostel-Authority registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newAuthority.name,
          hostelNo: newAuthority.hostelNo,
          roleType: newAuthority.roleType
        },
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Transaction error in AdminRegistration:', error);
      return res.status(500).json({ error: error.message });
    }

  } catch (error) {
    console.error('Error in AdminRegistration:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = AdminRegistration;

const db = require('../../../models/index');
const bcrypt = require('bcrypt');
const mailSender = require('../../../utils/mailSender');
const AccountCreation = require('../../../MailTemplates/StudentRegistrationTemplates/AccountCreation');

exports.studentTempAccCreate = async (req, res) => {
  try {
    const { email, tokenEmail, sendEmail } = req.body;
    const adminEmail = tokenEmail; // Get admin email from tokenEmail set by auth middleware

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

     // Check if email already exists in main users table
     const existingUser = await db.users.findOne({ where: { email } });
     if (existingUser) {
       return res.status(400).json({ error: 'Email already registered in main system' });
     }

    // Check if already exists in temp table
    const existing = await db.studentTemp.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already has a temporary account' });
    }

    // Get the admin's hostel number
    const admin = await db.hostelauthoritys.findOne({
      where: { email: adminEmail }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const hostelNo = admin.hostelNo;

    // Generate random password
    const plainPassword = [...Array(8)]
    .map(() => Math.random().toString(36).charAt(2)) // charAt(2) avoids "." and "0"
    .join('');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Set expiration date (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Save to DB with hashed password
    const tempAccount = await db.studentTemp.create({
      email,
      password: hashedPassword,
      expiresAt,
      status: 'pending',
      hostelNo: hostelNo
    });

    // Send email to student if sendEmail flag is true
    if (sendEmail) {
      try {
        const title = 'Your Temporary Account - NIT Hostel Management System';
        await mailSender(email, title, AccountCreation(email, plainPassword));
        console.log('Account creation email sent successfully to', email);
      } catch (emailError) {
        console.error('Error sending account creation email:', emailError);
        // Continue execution even if email fails
      }
    }

    // Return the plain password in the response (not the hashed one)
    return res.status(201).json({
      message: 'Temporary student account created successfully',
      email: tempAccount.email,
      password: plainPassword, // Return plain password for display
      expiresAt: tempAccount.expiresAt,
      emailSent: sendEmail ? true : false
    });

  } catch (error) {
    console.error("Error in studentTempAccCreate:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllStudentTempAccounts = async (req, res) => {
    try {
      // For existing accounts, we can't retrieve the plain passwords
      // since they're hashed. We'll just return the accounts without passwords
      // and rely on newly created accounts to have their passwords displayed.
      const accounts = await db.studentTemp.findAll({
        attributes: ['email', 'createdAt', 'expiresAt', 'status'], // Removed password from returned fields
        order: [['createdAt', 'DESC']] // Optional: Latest first
      });

      return res.status(200).json(accounts);
    } catch (error) {
      console.error("Error fetching student temp accounts:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const db = require('../../models/index');

const normalizeMobile = (mobile) => String(mobile || '').replace(/\D/g, '').slice(-10);

const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

const updateMobile = async (req, res) => {
  try {
    const email = req.user?.email || req.body.tokenEmail;
    const role = req.user?.role || req.body.TokenRole;
    const mobile = normalizeMobile(req.body.mobile);

    if (!email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!isValidMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must be a valid 10 digit Indian number'
      });
    }

    const existing = await db.users.findOne({
      where: {
        mobile,
        email: { [db.Sequelize.Op.ne]: email }
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This mobile number is already linked with another HMS account'
      });
    }

    await db.users.update({ mobile }, { where: { email } });

    if (role === 'Hostel-Authority') {
      await db.hostelauthoritys.update({ mobile }, { where: { email } });
    }

    if (role === 'Student') {
      const student = await db.students.findOne({ where: { email } });
      if (student) {
        await db.profiles.update({ contactNumber: mobile }, { where: { rollNo: student.rollNo } });
      }
    }

    return res.status(200).json({ success: true, mobile });
  } catch (error) {
    console.error('updateMobile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update mobile number' });
  }
};

module.exports = { updateMobile };

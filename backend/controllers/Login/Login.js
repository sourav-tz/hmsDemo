const db = require('../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password and role are required." });
    }

    // Step 1: Check in main users table
    const user = await db.users.findOne({ where: { email: email } });
    console.log("Main user record:", user);

    if (user) {
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Username or Password" });
      }

      // Step 2: Role validation
      if (user.role !== role) {
        return res.status(403).json({
          message: "Unauthorized access. Role mismatch.",
          expectedRole: user.role
        });
      }

      let accessToken;
      let UserData;

      // Step 3: Fetch user-specific data
      if (user.role === 'Student') {
        UserData = await db.students.findOne({ where: { email: email } });
      } else if (user.role === 'Hostel-Authority') {
        UserData = await db.hostelauthoritys.findOne({ where: { email: email } });
      } else if (user.role === 'Admin') {
        UserData = await db.admins.findOne({ where: { email: email } }); // optional if you have admin table
      }

      console.log("UserData fetched:", UserData);

      // Step 4: Generate JWT token
      try {
        accessToken = jwt.sign(
          {
            email: email,
            role: user.role,
            rollNo: UserData?.rollNo,
            hostelNo: UserData?.hostelNo
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
      } catch (error) {
        console.log("Error generating JWT:", error);
        return res.status(400).json({ message: "Error generating token" });
      }

      // Step 5: Cookie settings
      // Bug fix by Ravi: Local dev fix - secure+sameSite:none requires HTTPS; on localhost cookies were silently dropped causing 401 on every request after login
      const isProduction = process.env.NODE_ENV === 'production';
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      };

      // ✅ Return response in the same Sequelize structure
      return res.cookie('hostelAccessToken', accessToken, options).json({
        ...UserData, // keeps Sequelize object (dataValues, etc.)
        role: user.role,
        roleType: user.role,
        mobile: user.mobile
      });
    }

    // Step 6: Check in temporary student table (if not in main)
    let tempStudent = null;
    if (db.studentTemp) {
      tempStudent = await db.studentTemp.findOne({ where: { email: email } });
    }

    if (!tempStudent) {
      return res.status(404).json({ error: `User doesn't exist` });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, tempStudent.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    // Step 7: Role check for temp student
    // if (role !== 'TempStudent') {
    //   return res.status(403).json({
    //     message: "Unauthorized access. Role mismatch.",
    //     expectedRole: "TempStudent"
    //   });
    // }

    // Step 8: Generate token
    const accessToken = jwt.sign(
      {
        email: tempStudent.email,
        role: 'TempStudent',
        rollNo: tempStudent.rollNo,
        status: tempStudent.status
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    // Bug fix by Ravi: Local dev fix - same as above; TempStudent cookie also needs lax/insecure for localhost
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      path: "/",
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    };

    const plainTempStudent = tempStudent.get({ plain: true });

    return res
      .cookie('hostelAccessToken', accessToken, options)
      .json({
        email: plainTempStudent.email,
        roleType: 'TempStudent',
        status: plainTempStudent.status
      });
    
    

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = Login;

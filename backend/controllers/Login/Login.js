// const db = require('../../models/index')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')



// const Login = async (req, res) => {

//     try {
//         const { email, password } = req.body;

//         // First check in main users table
//         const user = await db.users.findOne({ where: { email: email } });
//         console.log(user);

//         if (user) {
//             // Regular user login flow
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (isMatch) {
//                 let accessToken;
//                 let UserData;

//                 if(user.role === 'Student'){
//                     UserData = await db.students.findOne({ where: {email: email}})
//                 } else if(user.role === 'Hostel-Authority'){
//                     UserData = await db.hostelauthoritys.findOne({ where: { email: email } });
//                 }

//                 console.log("UserData in login controller", UserData);

//                 try {
//                     accessToken = jwt.sign({ email: email, hostelNo: UserData.hostelNo, role: user.role },
//                         process.env.JWT_SECRET_KEY
//                     );

//                 } catch (error) {
//                     console.log("the error occurred generate auth token function" + error);
//                     return res.status(400).json("the error occurred in generate auth token function" + error);
//                 }

//                 const options = {
//                     expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//                     // expires:10000,
//                     httpOnly: true,
//                     path: "/",
//                     sameSite: 'lax',
//                     secure: true
//                 }
//                 console.log(accessToken);
//                 // we are storing cookie in jwtoken and it will expires in 30days
//                 // Return consistent data structure with roleType for both regular and temp students
//                 return res.cookie('hostelAccessToken', accessToken, options).json({
//                     ...UserData,
//                     role: user.role,
//                     roleType: user.role // Add roleType to match the structure used for temp students
//                 });

//             } else {
//                 return res.status(401).json({message:"Invalid Username or Password"});
//             }
//         } else {
//             // If not found in main users table, check temp student accounts
//             let tempStudent = null;

//             try {
//                 // Check if studentTemp model exists before querying
//                 if (db.studentTemp) {
//                     tempStudent = await db.studentTemp.findOne({ where: { email: email } });

//                     if (!tempStudent) {
//                         return res.status(404).json({ error: `User doesn't exist` });
//                     }
//                 } else {
//                     console.log("studentTemp model not found");
//                     return res.status(404).json({ error: `User doesn't exist` });
//                 }
//             } catch (error) {
//                 console.log("Error checking temp student:", error);
//                 return res.status(404).json({ error: `User doesn't exist` });
//             }

//             // At this point, we have a valid tempStudent

//             // Verify password for temp student
//             const isMatch = await bcrypt.compare(password, tempStudent.password);

//             if (!isMatch) {
//                 return res.status(401).json({ message: "Invalid Username or Password" });
//             }

//             // Create JWT token with TempStudent role
//             const accessToken = jwt.sign(
//                 {
//                     email: tempStudent.email,
//                     role: 'TempStudent',
//                     status: tempStudent.status
//                 },
//                 process.env.JWT_SECRET_KEY,
//                 { expiresIn: '1d' }
//             );

//             // Set cookie with same options as regular login
//             const options = {
//                 expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//                 httpOnly: true,
//                 path: "/",
//                 sameSite: 'lax',
//                 secure: true
//             };

//             console.log("Temp student login:", tempStudent.email);
//             console.log(accessToken);

//             // Return temp student data with role
//             return res.cookie('hostelAccessToken', accessToken, options)
//                 .json({
//                     email: tempStudent.email,
//                     roleType: 'TempStudent',
//                     status: tempStudent.status
//                 });
//         }

//     } catch(error){
//         console.log(error);
//         res.status(500).json({ message: error.message })
//     }

// }

// module.exports = Login

const db = require('../../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check in main users table
    const user = await db.users.findOne({ where: { email } });
    if (user) {
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Username or Password" });
      }

      // 2. Determine user data source
      let UserData = null;
      if (user.role === 'Student') {
        UserData = await db.students.findOne({ where: { email } });
      } else if (user.role === 'Hostel-Authority') {
        UserData = await db.hostelauthoritys.findOne({ where: { email } });
      }

      // 3. Create JWT
      let accessToken;
      try {
        accessToken = jwt.sign(
          { email, hostelNo: UserData?.hostelNo, role: user.role },
          process.env.JWT_SECRET_KEY
        );
      } catch (error) {
        console.error("JWT generation error:", error);
        return res.status(400).json({ message: "Error generating token" });
      }

      // 4. Set cookie options
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
        sameSite: 'lax',
        secure: true
      };

      // ✅ Convert Sequelize model to plain JSON (critical fix)
      const plainUser = UserData ? UserData.get({ plain: true }) : {};

      // 5. Send response
      return res
        .cookie('hostelAccessToken', accessToken, options)
        .json({
          id: user.id,
          email: user.email,
          role: user.role,
          roleType: user.role,
          name: plainUser.name || null,
          hostelNo: plainUser.hostelNo || null,
          mobile: plainUser.mobile || null,
          roleTypeHostel: plainUser.roleType || null
        });

    } else {
      // 6. Handle temp student accounts
      let tempStudent = null;
      if (db.studentTemp) {
        tempStudent = await db.studentTemp.findOne({ where: { email } });
        if (!tempStudent) {
          return res.status(404).json({ error: `User doesn't exist` });
        }
      }

      const isMatch = await bcrypt.compare(password, tempStudent.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Username or Password" });
      }

      const accessToken = jwt.sign(
        {
          email: tempStudent.email,
          role: 'TempStudent',
          status: tempStudent.status
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
      );

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
        sameSite: 'lax',
        secure: true
      };

      return res
        .cookie('hostelAccessToken', accessToken, options)
        .json({
          email: tempStudent.email,
          roleType: 'TempStudent',
          status: tempStudent.status
        });
    }

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = Login;

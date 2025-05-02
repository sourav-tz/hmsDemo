

// tempStudentProfiles model
module.exports = (sequelize, dataTypes) => {
    const tempStudentProfiles = sequelize.define('tempStudentProfiles', {
      rollNo: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1,
          max: 999999999, // Allow up to 9-digit roll numbers
        },
      },
      email: {
        type: dataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      firstName: {
        type: dataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
      lastName: {
        type: dataTypes.STRING,
        validate: {
          len: [0, 50],
        },
      },
      dob: {
        type: dataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      course: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      semester: {
        type: dataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 1,
          max: 8,
        },
      },
      branch: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      contactNumber_1: {
        type: dataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: {
            args: /^[6-9]\d{9}$/,
            msg: 'Contact number must be 10 digits.',
          },
        },
      },
      contactNumber_2: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[6-9]\d{9}$/,
            msg: 'Contact number must be 10 digits .',
          },
        },
      },
      phoneNumber: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[6-9]\d{9}$/,
            msg: 'Contact number must be 10 digits .',
          },
        },
      },
      identificationMark: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      bloodGroup: {
        type: dataTypes.STRING,
        validate: {
          isIn: [['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']],
        },
      },
      gender: {
        type: dataTypes.STRING,
        validate: {
          isIn: [['Male', 'Female', 'Other']],
        },
      },
      fatherName: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      fatherContact: {
        type: dataTypes.STRING,
        validate: {
          is: {
            args: /^[6-9]\d{9}$/,
            msg: 'Contact number must be 10 digits .',
          },
        },
      },
      fatherOccupation: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      motherName: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      motherContact: {
        type: dataTypes.STRING,
        validate: {
          is: {
            args: /^[6-9]\d{9}$/,
            msg: 'Contact number must be 10 digits .',
          },
        },
      },
      motherOccupation: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      address: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      city: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      state: {
        type: dataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      pinCode: {
        type: dataTypes.STRING,
        validate: {
          isNumeric: true,
          len: [6, 6],
        },
      },
      localGuardian: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      localGuardianContact: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[6-9]\d{9}$/,
            msg: 'Contact number must be 10 digits.',
          },
        },
      },
      localGuardianAddress: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      addharNumber: {
        type: dataTypes.STRING,
        validate: {
          isNumeric: true,
          len: [12, 12],
        },
      },
      photoLink: {
        type: dataTypes.STRING,
        validate: {
          isUrl: true,
        },
      },
      aadharCardDocument: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
    });

    // Association with tempStudentAccounts
    tempStudentProfiles.associate = (models) => {
      tempStudentProfiles.belongsTo(models.studentTemp, {
        foreignKey: 'email',
        targetKey: 'email',
      });
    };

    return tempStudentProfiles;
  };



// // Flow Implementation
// // Step 1: Admin Creates Temp Account

// // createTempStudentAccount controller
// const createTempStudentAccount = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if email already exists in main users table
//     const existingUser = await db.users.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered in main system' });
//     }

//     // Check if email already exists in temp accounts
//     const existingTemp = await db.tempStudentAccounts.findOne({ where: { email } });
//     if (existingTemp) {
//       return res.status(400).json({ error: 'Temporary account already exists for this email' });
//     }

//     // Generate random password
//     const password = generateRandomPassword(); // Implement this function
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create temp account
//     await db.tempStudentAccounts.create({
//       email,
//       password: hashedPassword,
//       status: 'pending'
//     });

//     // Send email with credentials (optional)
//     // ...

//     return res.status(201).json({
//       success: true,
//       message: 'Temporary account created',
//       plainPassword: password // Only return in development, remove in production
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };


// // Step 2: Student Login
// // Modified login controller
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // First check main users table
//     const user = await db.users.findOne({ where: { email } });

//     if (user) {
//       // Regular login flow
//       // ...existing code...
//     } else {
//       // Check temp accounts
//       const tempAccount = await db.tempStudentAccounts.findOne({ where: { email } });

//       if (!tempAccount) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       // Verify password
//       const isMatch = await bcrypt.compare(password, tempAccount.password);
//       if (!isMatch) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       // Create token with special role
//       const token = jwt.sign(
//         { email, role: 'TempStudent', status: tempAccount.status },
//         process.env.JWT_SECRET_KEY,
//         { expiresIn: '1d' }
//       );

//       // Set cookie
//       res.cookie('hostelAccessToken', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production'
//       });

//       return res.status(200).json({
//         success: true,
//         role: 'TempStudent',
//         status: tempAccount.status
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };


// //Step 3: Student Submits Profile
// // submitStudentProfile controller
// const submitStudentProfile = async (req, res) => {
//   const { tokenEmail, TokenRole } = req.body;

//   // Only temp students can submit profiles
//   if (TokenRole !== 'TempStudent') {
//     return res.status(403).json({ error: 'Unauthorized' });
//   }

//   const transaction = await db.sequelize.transaction();

//   try {
//     // Get profile data from request
//     const profileData = {
//       email: tokenEmail,
//       rollNo: req.body.rollNo,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       // ... all other profile fields
//       submissionDate: new Date()
//     };

//     // Check if profile already exists
//     const existingProfile = await db.tempStudentProfiles.findOne({
//       where: { email: tokenEmail },
//       transaction
//     });

//     if (existingProfile) {
//       // Update existing profile
//       await existingProfile.update(profileData, { transaction });
//     } else {
//       // Create new profile
//       await db.tempStudentProfiles.create(profileData, { transaction });
//     }

//     // Update account status
//     await db.tempStudentAccounts.update(
//       { status: 'profile_submitted' },
//       { where: { email: tokenEmail }, transaction }
//     );

//     await transaction.commit();

//     return res.status(200).json({
//       success: true,
//       message: 'Profile submitted successfully'
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// //Step 4: Admin Gets Pending Profiles
// // getPendingProfiles controller
// const getPendingProfiles = async (req, res) => {
//   try {
//     // Join temp accounts and profiles
//     const pendingProfiles = await db.tempStudentProfiles.findAll({
//       include: [{
//         model: db.tempStudentAccounts,
//         where: { status: 'profile_submitted' },
//         attributes: ['email', 'status', 'createdAt']
//       }]
//     });

//     return res.status(200).json({
//       success: true,
//       data: pendingProfiles
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// //Step 5: Admin Approves Profile
// // approveStudentProfile controller
// const approveStudentProfile = async (req, res) => {
//   const { email } = req.params;
//   const transaction = await db.sequelize.transaction();

//   try {
//     // Get temp account and profile
//     const tempAccount = await db.tempStudentAccounts.findOne({
//       where: { email, status: 'profile_submitted' },
//       transaction
//     });

//     if (!tempAccount) {
//       await transaction.rollback();
//       return res.status(404).json({ error: 'Valid pending profile not found' });
//     }

//     const tempProfile = await db.tempStudentProfiles.findOne({
//       where: { email },
//       transaction
//     });

//     if (!tempProfile) {
//       await transaction.rollback();
//       return res.status(404).json({ error: 'Profile data not found' });
//     }

//     // 1. Create user record
//     await db.users.create({
//       email: tempProfile.email,
//       password: tempAccount.password, // Already hashed
//       role: 'Student'
//     }, { transaction });

//     // 2. Create student record
//     await db.students.create({
//       rollNo: tempProfile.rollNo,
//       firstName: tempProfile.firstName,
//       lastName: tempProfile.lastName,
//       year: tempProfile.year,
//       email: tempProfile.email,
//       courseId: tempProfile.courseId // Map from course name if needed
//     }, { transaction });

//     // 3. Create profile record
//     await db.profiles.create({
//       rollNo: tempProfile.rollNo,
//       bloodGroup: tempProfile.bloodGroup,
//       gender: tempProfile.gender,
//       // ... all other profile fields
//     }, { transaction });

//     // 4. Create bank details record
//     await db.bankdetails.create({
//       rollNo: tempProfile.rollNo
//     }, { transaction });

//     // 5. Update temp account status
//     await tempAccount.update({ status: 'approved' }, { transaction });

//     await transaction.commit();

//     return res.status(200).json({
//       success: true,
//       message: 'Student profile approved and accounts created'
//     });

//   } catch (error) {
//     await transaction.rollback();
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };


// Step 6: Admin Rejects Profile

// // rejectStudentProfile controller
// const rejectStudentProfile = async (req, res) => {
//   const { email } = req.params;

//   try {
//     // Update temp account status
//     const updated = await db.tempStudentAccounts.update(
//       { status: 'rejected' },
//       { where: { email, status: 'profile_submitted' } }
//     );

//     if (updated[0] === 0) {
//       return res.status(404).json({ error: 'Valid pending profile not found' });
//     }

//     return res.status(200).json({
//       success: true,
//       message: 'Student profile rejected'
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// // Benefits of This Approach
// // Clear Separation of Concerns:
// // One table for authentication (tempStudentAccounts)
// // One table for profile data (tempStudentProfiles)
// // Flexible Workflow:
// // Students can update their profile multiple times before approval
// // Admin can reject and allow resubmission
// // Data Integrity:
// // Main tables only contain verified data
// // Temporary data is kept separate until approval
// // Audit Trail:
// // You maintain a record of all applications, even rejected ones
// // Can track when accounts were created vs. when profiles were submitted
// // This approach aligns perfectly with your described workflow while keeping the system modular and maintainable. It also minimizes the risk of data inconsistency by using transactions for all operations that touch multiple tables.
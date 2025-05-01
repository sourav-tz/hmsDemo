// backend/controllers/student/studentSelfProfiling.js

const db = require('../../models/index');
const { validationResult, checkSchema } = require('express-validator');
const { uploadToCloudinary } = require('../../utils/cloudinary');

// File size limits in bytes
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MIN_FILE_SIZE = 1 * 1024; // 1KB

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf'
];

// Handle document uploads
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Validate file size
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }

    if (req.file.size < MIN_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: `File is too small. Minimum size is ${MIN_FILE_SIZE / 1024}KB`
      });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: JPEG, PNG, JPG, WEBP, PDF`
      });
    }

    // Upload file to Cloudinary
    const result = await uploadToCloudinary(req.file, 'student_documents');

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        public_id: result.public_id,
        url: result.url
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

// Validation schema
// Validation schema for student profile
exports.profileValidationSchema = {
    rollNo: {
      in: ['body'],
      isInt: {
        errorMessage: 'Roll number must be an integer.',
      },
      notEmpty: {
        errorMessage: 'Roll number is required.',
      },
    },
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: 'Invalid email format.',
      },
      notEmpty: {
        errorMessage: 'Email is required.',
      },
    },
    firstName: {
      in: ['body'],
      isString: {
        errorMessage: 'First name must be a string.',
      },
      isLength: {
        options: { min: 1, max: 50 },
        errorMessage: 'First name must be between 1 and 50 characters.',
      },
      notEmpty: {
        errorMessage: 'First name is required.',
      },
    },
    lastName: {
      in: ['body'],
      isString: {
        errorMessage: 'Last name must be a string.',
      },
      isLength: {
        options: { min: 0, max: 50 },
        errorMessage: 'Last name must be between 1 and 50 characters.',
      },
      notEmpty: {
        errorMessage: 'Last name is required.',
      },
    },
    dob: {
      in: ['body'],
      isDate: {
        errorMessage: 'Date of birth must be a valid date.',
      },
      notEmpty: {
        errorMessage: 'Date of birth is required.',
      },
    },
    course: {
      in: ['body'],
      isString: {
        errorMessage: 'Course must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'Course name must not exceed 100 characters.',
      },
      notEmpty: {
        errorMessage: 'Course is required.',
      },
    },
    semester: {
      in: ['body'],
      isInt: {
        options: { min: 1, max: 8 },
        errorMessage: 'Semester must be an integer between 1 and 8.',
      },
      notEmpty: {
        errorMessage: 'Semester is required.',
      },
    },
    branch: {
      in: ['body'],
      isString: {
        errorMessage: 'Branch must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'Branch name must not exceed 100 characters.',
      },
      notEmpty: {
        errorMessage: 'Branch is required.',
      },
    },
    contactNumber_1: {
      in: ['body'],
      matches: {
        options: [/^\d{10}$/],
        errorMessage: 'Contact number must be exactly 10 digits.',
      },
      notEmpty: {
        errorMessage: 'Primary contact number is required.',
      },
    },
    contactNumber_2: {
      in: ['body'],
      optional: true,
      matches: {
        options: [/^\d{10}$/],
        errorMessage: 'Secondary contact number must be exactly 10 digits.',
      },
    },
    phoneNumber: {
      in: ['body'],
      optional: true,
      matches: {
        options: [/^[6-9]\d{9}$/],
        errorMessage: 'Phone number must be exactly 10 digits starting with 6-9.',
      },
    },
    gender: {
      in: ['body'],
      isIn: {
        options: [['Male', 'Female', 'Other']],
        errorMessage: 'Gender must be Male, Female, or Other.',
      },
      notEmpty: {
        errorMessage: 'Gender is required.',
      },
    },
    bloodGroup: {
      in: ['body'],
      optional: true,
      isIn: {
        options: [['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']],
        errorMessage: 'Invalid blood group.',
      },
    },
    pinCode: {
      in: ['body'],
      matches: {
        options: [/^\d{6}$/],
        errorMessage: 'Pin code must be exactly 6 digits.',
      },
      notEmpty: {
        errorMessage: 'Pin code is required.',
      },
    },
    addharNumber: {
      in: ['body'],
      optional: true,
      matches: {
        options: [/^\d{12}$/],
        errorMessage: 'Aadhaar number must be exactly 12 digits.',
      },
    },
    fatherName: {
      in: ['body'],
      isString: {
        errorMessage: 'Father’s name must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'Father’s name must not exceed 100 characters.',
      },
      notEmpty: {
        errorMessage: 'Father’s name is required.',
      },
    },
    fatherContact: {
      in: ['body'],
      matches: {
        options: [/^\d{10}$/],
        errorMessage: 'Father’s contact number must be exactly 10 digits.',
      },
      notEmpty: {
        errorMessage: 'Father’s contact number is required.',
      },
    },
    motherName: {
      in: ['body'],
      isString: {
        errorMessage: 'Mother’s name must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'Mother’s name must not exceed 100 characters.',
      },
      notEmpty: {
        errorMessage: 'Mother’s name is required.',
      },
    },
    motherContact: {
      in: ['body'],
      matches: {
        options: [/^\d{10}$/],
        errorMessage: 'Mother’s contact number must be exactly 10 digits.',
      },
      notEmpty: {
        errorMessage: 'Mother’s contact number is required.',
      },
    },
    address: {
      in: ['body'],
      isString: {
        errorMessage: 'Address must be a string.',
      },
      isLength: {
        options: { max: 250 },
        errorMessage: 'Address must not exceed 250 characters.',
      },
      notEmpty: {
        errorMessage: 'Address is required.',
      },
    },
    city: {
      in: ['body'],
      isString: {
        errorMessage: 'City must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'City name must not exceed 100 characters.',
      },
      notEmpty: {
        errorMessage: 'City is required.',
      },
    },
    state: {
      in: ['body'],
      isString: {
        errorMessage: 'State must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'State name must not exceed 100 characters.',
      },
      notEmpty: {
        errorMessage: 'State is required.',
      },
    },
    localGuardian: {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Local guardian’s name must be a string.',
      },
      isLength: {
        options: { max: 100 },
        errorMessage: 'Local guardian’s name must not exceed 100 characters.',
      },
    },
    localGuardianContact: {
      in: ['body'],
      optional: true,
      matches: {
        options: [/^\d{10}$/],
        errorMessage: 'Local guardian’s contact number must be exactly 10 digits.',
      },
    },
    localGuardianAddress: {
      in: ['body'],
      optional: true,
      isString: {
        errorMessage: 'Local guardian’s address must be a string.',
      },
      isLength: {
        options: { max: 250 },
        errorMessage: 'Local guardian’s address must not exceed 250 characters.',
      },
    },
  };


// Get profile data
exports.getProfile = async (req, res) => {
  // Get email and role from query params or body
  const tokenEmail = req.query.tokenEmail || req.body.tokenEmail;
  const TokenRole = req.query.TokenRole || req.body.TokenRole;

  console.log("getProfile called with:", { tokenEmail, TokenRole });

  try {
    if (TokenRole === 'TempStudent') {
      // For temporary students - get from temp tables
      console.log("Fetching temp profile for:", tokenEmail);

      const tempProfile = await db.tempStudentProfiles.findOne({
        where: { email: tokenEmail }
      });

      console.log("Temp profile found:", !!tempProfile);

      // Also get the status from studentTemp
      const tempAccount = await db.studentTemp.findOne({
        where: { email: tokenEmail }
      });

      console.log("Temp account found:", !!tempAccount);

      // If profile exists but has no photo, add the mock URL
      let profileData = tempProfile ? { ...tempProfile.dataValues } : {};
      if (profileData && !profileData.photoLink) {
        profileData.photoLink = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s';
      }

      // Check if the profile is rejected and has a rejection reason
      let rejectionReason = null;
      if (tempAccount && tempAccount.status === 'rejected') {
        rejectionReason = tempAccount.rejectionReason || 'Your profile has been rejected. Please update your information and resubmit.';
      }

      return res.status(200).json({
        success: true,
        exists: !!tempProfile,
        profile: profileData,
        status: tempAccount ? tempAccount.status : 'pending',
        rejectionReason: rejectionReason
      });

    } else if (TokenRole === 'Student') {
      // For regular students - get from main tables
      const student = await db.students.findOne({
        where: { email: tokenEmail }
      });

      if (!student) {
        return res.status(404).json({ error: 'Student record not found' });
      }

      return res.status(200).json({
        success: true,
        exists: true,
        profile: student
      });
    } else {
      return res.status(403).json({ error: 'Unauthorized role' });
    }

  } catch (error) {
    console.error("Error in getProfile:", error);
    console.error("Error stack:", error.stack);

    // Check if it's a database connection error
    if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
      return res.status(500).json({ error: 'Database connection error. Please try again later.' });
    }

    // Check if it's a database query error
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({ error: 'Database query error: ' + error.message });
    }

    return res.status(500).json({
      error: 'An error occurred while fetching profile data.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controller method for submitting profile
/**
 * Check if a roll number already exists in the system
 *
 * This endpoint verifies if a roll number is already in use by another student.
 * It has special handling for resubmissions to allow students to reuse their own
 * roll number after a profile rejection.
 *
 * Authentication: Required - only logged-in users can check roll numbers
 * Authorization: Any authenticated user (Student or TempStudent)
 */
// Get available courses and branches
exports.getAvailableCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await db.courses.findAll({
      attributes: ['courseId', 'courseName', 'department', 'specialization'],
      where: {
        // Only include active courses (not deleted)
        deletedAt: null
      }
    });

    // Transform the data into a more usable format for the frontend
    const formattedCourses = [];
    const branches = new Set();

    courses.forEach(course => {
      // Add course if not already in the list
      if (!formattedCourses.some(c => c.value === course.courseName)) {
        formattedCourses.push({
          value: course.courseName,
          label: course.courseName
        });
      }

      // Add department/branch if not already in the set
      if (course.department) {
        branches.add(course.department);
      }
    });

    // Convert branches set to array of objects
    const formattedBranches = Array.from(branches).map(branch => ({
      value: branch,
      label: branch
    }));

    return res.status(200).json({
      success: true,
      courses: formattedCourses,
      branches: formattedBranches
    });
  } catch (error) {
    console.error('Error fetching available courses:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching available courses'
    });
  }
};

exports.checkRollNumber = async (req, res) => {
  try {
    // Extract roll number from URL parameters
    const { rollNo } = req.params;

    // Extract authenticated user information from request body (set by auth middleware)
    const { tokenEmail, TokenRole } = req.body;

    // Validate input
    if (!rollNo) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    console.log(`Roll number check requested by ${TokenRole} (${tokenEmail}) for rollNo: ${rollNo}`);

    // Flag to determine if we should skip the duplicate check
    // This is used for resubmissions where a student should be allowed to use their own roll number
    let skipCheck = false;

    // Special handling for temporary students (students in the verification process)
    if (TokenRole === 'TempStudent') {
      // Look up the student's own profile to see if they already have a roll number
      const ownProfile = await db.tempStudentProfiles.findOne({
        where: { email: tokenEmail }
      });

      // If the student has a profile and is checking their own roll number,
      // we allow them to reuse it (for example, after a rejection for other reasons)
      if (ownProfile && ownProfile.rollNo.toString() === rollNo.toString()) {
        console.log('User is checking their own roll number for resubmission');
        skipCheck = true;
      }
    }

    // If we're not skipping the check (i.e., this is a new submission or the roll number has changed)
    if (!skipCheck) {
      // First, check if the roll number exists in the main students table
      // This covers students who are already fully registered in the system
      const existingStudent = await db.students.findOne({
        where: { rollNo: rollNo }
      });

      // Import Sequelize operators for advanced queries
      const { Op } = require('sequelize');

      // Next, check if the roll number exists in the temporary profiles table
      // This covers students who are in the verification process but not yet approved
      // We exclude the user's own profile to avoid false positives during resubmission
      const existingTempProfile = await db.tempStudentProfiles.findOne({
        where: {
          rollNo: rollNo,
          // Using the "not equal" operator to exclude the current user's email
          // This ensures we only find roll numbers used by OTHER students
          email: { [Op.ne]: tokenEmail }
        }
      });

      // If the roll number exists in either the main table or another temp profile,
      // it's considered a duplicate and cannot be used
      if (existingStudent || existingTempProfile) {
        return res.status(200).json({
          success: true,
          exists: true,
          message: 'Roll number already exists in the system'
        });
      }
    }

    // If we reach this point, either:
    // 1. The roll number doesn't exist in the system, or
    // 2. It's the user's own roll number from a previous submission
    // In either case, the roll number is available for this user to use
    return res.status(200).json({
      success: true,
      exists: false,
      message: 'Roll number is available'
    });
  } catch (error) {
    console.error('Error checking roll number:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking the roll number'
    });
  }
};



exports.studentSelfProfiling = async (req, res) => {
  const { tokenEmail, TokenRole } = req.body;

  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array(),
    });
  }

  // Start a transaction
  const transaction = await db.sequelize.transaction();

  try {
    if (TokenRole === 'TempStudent') {
      // Handle TempStudent case
      const tempAccount = await db.studentTemp.findOne({
        where: { email: tokenEmail },
        transaction,
      });

      if (!tempAccount) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Temporary account not found' });
      }

      // Extract profile data
      const profileData = {
        email: tokenEmail,
        rollNo: req.body.rollNo,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        course: req.body.course,
        semester: req.body.semester,
        branch: req.body.branch,
        contactNumber_1: req.body.contactNumber_1,
        contactNumber_2: req.body.contactNumber_2,
        phoneNumber: req.body.phoneNumber || req.body.contactNumber_1, // Use contactNumber_1 as fallback
        identificationMark: req.body.identificationMark,
        bloodGroup: req.body.bloodGroup,
        gender: req.body.gender,
        fatherName: req.body.fatherName,
        fatherContact: req.body.fatherContact,
        fatherOccupation: req.body.fatherOccupation,
        motherName: req.body.motherName,
        motherContact: req.body.motherContact,
        motherOccupation: req.body.motherOccupation,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
        localGuardian: req.body.localGuardian,
        localGuardianContact: req.body.localGuardianContact,
        localGuardianAddress: req.body.localGuardianAddress,
        addharNumber: req.body.addharNumber,
        // Use the provided photoLink or the default one
        photoLink: req.body.photoLink || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrxb9rKS0KgjTtqrKPK8dodc0pEeaoC-pY_w&s',
        // Add document links if provided
        aadharCardDocument: req.body.aadharCardDocument || null,
      };

      // Insert or update profile
      await db.tempStudentProfiles.upsert(profileData, { transaction });

      // Update status in studentTemp table
      await tempAccount.update({ status: 'profile_submitted' }, { transaction });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: 'Profile submitted for verification.',
      });
    } else if (TokenRole === 'Student') {
      // Handle Student case
      const student = await db.students.findOne({
        where: { email: tokenEmail },
        transaction,
      });

      if (!student) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Student record not found' });
      }

      // Update student record
      await student.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
        course: req.body.course,
        semester: req.body.semester,
        branch: req.body.branch,
        contactNumber_1: req.body.contactNumber_1,
        contactNumber_2: req.body.contactNumber_2,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
      }, { transaction });

      // Commit transaction
      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
      });
    }

    // Role not recognized
    await transaction.rollback();
    return res.status(400).json({ error: 'Invalid role provided.' });
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ error: 'An error occurred during submission.' });
  }
};

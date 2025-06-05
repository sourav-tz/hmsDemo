const { check, validationResult } = require('express-validator');
const db = require('../../../models');
const { sequelize } = require('../../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailSender = require('../../../utils/mailSender');
const ProfileApproval = require('../../../MailTemplates/StudentRegistrationTemplates/ProfileApproval');
const ProfileRejection = require('../../../MailTemplates/StudentRegistrationTemplates/ProfileRejection');

// Get all pending student profiles
exports.getPendingProfiles = async (req, res) => {
  try {
    // Get the admin's hostel number from the token
    const adminEmail = req.body.tokenEmail;

    // Get the admin's hostel number
    const admin = await db.hostelauthoritys.findOne({
      where: { email: adminEmail }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    const hostelNo = admin.hostelNo;

    // Get all accounts with status 'profile_submitted' for this hostel
    const pendingAccounts = await db.studentTemp.findAll({
      where: {
        status: 'profile_submitted',
        hostelNo: hostelNo
      },
      order: [['createdAt', 'DESC']]
    });

    if (!pendingAccounts || pendingAccounts.length === 0) {
      return res.status(200).json({
        success: true,
        profiles: [],
        message: 'No pending profiles found for your hostel'
      });
    }

    // Get the emails of all pending accounts
    const emails = pendingAccounts.map(account => account.email);

    // Get the profiles for these emails
    const pendingProfiles = await db.tempStudentProfiles.findAll({
      where: {
        email: emails
      },
      include: [{
        model: db.studentTemp,
        attributes: ['status', 'createdAt', 'rejectionReason', 'hostelNo']
      }]
    });

    return res.status(200).json({
      success: true,
      profiles: pendingProfiles,
      message: 'Pending profiles retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching pending profiles:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get a specific student profile by email
exports.getProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find the profile in tempStudentProfiles
    const profile = await db.tempStudentProfiles.findOne({
      where: { email }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      profile,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Approve a student profile
exports.approveProfile = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find the profile in tempStudentProfiles
    const tempProfile = await db.tempStudentProfiles.findOne({
      where: { email },
      transaction: t
    });

    if (!tempProfile) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    // Find the account in studentTemp
    const tempAccount = await db.studentTemp.findOne({
      where: { email },
      transaction: t
    });

    if (!tempAccount) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Check if rollNo already exists in the students table
    const existingStudent = await db.students.findOne({
      where: { rollNo: tempProfile.rollNo },
      transaction: t
    });

    if (existingStudent) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        error: 'Roll number already exists in the system. This profile should be rejected with an appropriate message to the student.'
      });
    }

    // Check if email already exists in the users table
    const existingUser = await db.users.findOne({
      where: { email: tempProfile.email },
      transaction: t
    });

    if (existingUser) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        error: 'Email already exists in the system'
      });
    }

    // Calculate year from semester (if semester is available)
    let year = null;
    if (tempProfile.semester) {
      // Assuming semesters 1-2 = year 1, 3-4 = year 2, etc.
      year = Math.ceil(tempProfile.semester / 2);
    }

    // Fetch available courses
    const availableCourses = await db.courses.findAll({
      attributes: ['courseId', 'courseName', 'department'],
      transaction: t
    });

    // Find a matching course
    let courseId = null;
    for (const course of availableCourses) {
      // Check if course name matches and branch matches department
      if (
        course.courseName.toLowerCase() === tempProfile.course.toLowerCase() &&
        course.department.toLowerCase() === tempProfile.branch.toLowerCase()
      ) {
        courseId = course.courseId;
        break;
      }
    }

    // Log the mapping result
    console.log(`Course mapping: "${tempProfile.course}" (branch: "${tempProfile.branch}") -> courseId: ${courseId}`);

    // If no matching course is found, handle appropriately
    if (!courseId) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: `No matching course found for ${tempProfile.course} - ${tempProfile.branch}. Please reject this profile with an appropriate message.`
      });
    }

    // Create a new user in the users table
    await db.users.create({
      email: tempProfile.email,
      password: tempAccount.password, // Password is already hashed
      role: 'Student'
    }, { transaction: t });

    // Create a new student in the main students table
    await db.students.create({
      email: tempProfile.email,
      password: tempAccount.password, // Password is already hashed
      rollNo: tempProfile.rollNo,
      firstName: tempProfile.firstName,
      lastName: tempProfile.lastName,
      year: year, // Set year calculated from semester
      courseId: courseId, // Set courseId from mapping
      roleType: 'Student', // Change role from TempStudent to Student
      status: 'active',
      hostelNo: tempAccount.hostelNo, // Set hostelNo from the temp account
      roomId: null // Explicitly set roomId to null
    }, { transaction: t });

    // Create a new profile in the main profiles table
    await db.profiles.create({
      rollNo: tempProfile.rollNo,
      firstName: tempProfile.firstName,
      lastName: tempProfile.lastName,
      dob: tempProfile.dob,
      contactNumber: tempProfile.contactNumber_1,
      secondaryContact: tempProfile.contactNumber_2 && tempProfile.contactNumber_2.trim() !== '' ? tempProfile.contactNumber_2 : null,
      phoneNumber: tempProfile.phoneNumber && tempProfile.phoneNumber.trim() !== '' ? tempProfile.phoneNumber : null, // Add phoneNumber field
      pEmail: tempProfile.email, // Use email as pEmail
      identificationMark: tempProfile.identificationMark && tempProfile.identificationMark.trim() !== '' ? tempProfile.identificationMark : null,
      bloodGroup: tempProfile.bloodGroup,
      gender: tempProfile.gender,
      fatherName: tempProfile.fatherName,
      fatherContact: tempProfile.fatherContact,
      fatherOccupation: tempProfile.fatherOccupation && tempProfile.fatherOccupation.trim() !== '' ? tempProfile.fatherOccupation : null,
      motherName: tempProfile.motherName,
      motherContact: tempProfile.motherContact,
      motherOccupation: tempProfile.motherOccupation && tempProfile.motherOccupation.trim() !== '' ? tempProfile.motherOccupation : null,
      subAddress: tempProfile.address, // Map address to subAddress
      city: tempProfile.city,
      state: tempProfile.state,
      pinCode: tempProfile.pinCode,
      localGuardian: tempProfile.localGuardian && tempProfile.localGuardian.trim() !== '' ? tempProfile.localGuardian : null,
      localGuardianContact: tempProfile.localGuardianContact && tempProfile.localGuardianContact.trim() !== '' ? tempProfile.localGuardianContact : null,
      localGuardianAddress: tempProfile.localGuardianAddress && tempProfile.localGuardianAddress.trim() !== '' ? tempProfile.localGuardianAddress : null,
      addharNumber: tempProfile.addharNumber,
      photoLink: tempProfile.photoLink,
      aadharCardDocument: tempProfile.aadharCardDocument // Transfer Aadhar Card document
    }, { transaction: t });

    // Create an empty bank details record
    await db.bankdetails.create({
      rollNo: tempProfile.rollNo,
      accHolderName: '', // Empty string or null
      bankName: '',
      accNumber: '',
      IFSC: ''
    }, { transaction: t });

    // Update the status in studentTemp
    await tempAccount.update({
      status: 'approved'
    }, { transaction: t });

    // Send email notification to the student
    await sendApprovalEmail(tempProfile.email, tempProfile.firstName);

    await t.commit();

    return res.status(200).json({
      success: true,
      message: 'Profile approved successfully'
    });
  } catch (error) {
    await t.rollback();
    console.error('Error approving profile:', error);

    // Provide more detailed error messages
    let errorMessage = 'Internal server error';

    if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'A record with this information already exists';
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = 'Invalid data provided: ' + error.message;
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      errorMessage = 'Referenced record does not exist';
    }

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};

// Reject a student profile
exports.rejectProfile = async (req, res) => {
  try {
    const { email, rejectionReason } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find the account in studentTemp
    const tempAccount = await db.studentTemp.findOne({
      where: { email }
    });

    if (!tempAccount) {
      return res.status(404).json({
        success: false,
        error: 'Account not found'
      });
    }

    // Find the profile in tempStudentProfiles
    const profile = await db.tempStudentProfiles.findOne({
      where: { email }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    // Update the status in studentTemp
    await tempAccount.update({
      status: 'rejected',
      rejectionReason: rejectionReason || 'No reason provided'
    });

    // Send email notification to the student
    await sendRejectionEmail(profile.email, profile.firstName, rejectionReason);

    return res.status(200).json({
      success: true,
      message: 'Profile rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Helper function to send approval email
async function sendApprovalEmail(email, firstName) {
  try {
    // Use the ProfileApproval template and mailSender utility
    const title = 'Profile Approved - NIT Hostel Management System';
    await mailSender(email, title, ProfileApproval(firstName));
    console.log('Approval email sent successfully to', email);
  } catch (error) {
    console.error('Error sending approval email:', error);
    // Don't throw error, just log it
  }
}

// Helper function to send rejection email
async function sendRejectionEmail(email, firstName, rejectionReason) {
  try {
    // Use the ProfileRejection template and mailSender utility
    const title = 'Profile Needs Updates - NIT Hostel Management System';
    await mailSender(email, title, ProfileRejection(firstName, rejectionReason));
    console.log('Rejection email sent successfully to', email);
  } catch (error) {
    console.error('Error sending rejection email:', error);
    // Don't throw error, just log it
  }
}
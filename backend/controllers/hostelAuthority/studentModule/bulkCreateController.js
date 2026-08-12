const db = require('../../../models/index')
const bcrypt = require('bcrypt')

function filterDuplicates(array) {
  const duplicates = [];
  const unique = [];

  const seenEmails = {};
  const seenRollNos = {};

  // First pass: count frequency
  array.forEach((student) => {
    seenEmails[student.email] = (seenEmails[student.email] || 0) + 1;
    seenRollNos[student.rollNo] = (seenRollNos[student.rollNo] || 0) + 1;
  });

  // Second pass: separate unique and duplicates
  array.forEach((student) => {
    const isDuplicate = seenEmails[student.email] > 1 || seenRollNos[student.rollNo] > 1;
    if (isDuplicate) {
      duplicates.push({ message: "Email or rollNo common with other entry in CSV", ...student });
    } else {
      unique.push(student);
    }
  });

  return { duplicates, unique };
}

async function uploadStudents(data, hostelNo) {
  try {
    if (!/^[6-9]\d{9}$/.test(String(data.contactNumber || ''))) {
      throw new Error(`Valid 10 digit contactNumber is required for ${data.email}`);
    }

    const transaction = await db.sequelize.transaction();
    try {
      // 1. Create user account
      const salt = await bcrypt.genSalt(10);
      const password = data.contactNumber !== undefined ? String(data.contactNumber) : String(data.rollNo);
      const securePassword = await bcrypt.hash(password, salt);

      await db.users.create({
        email: data.email,
        password: securePassword,
        role: 'Student',
        mobile: data.contactNumber,
      }, { transaction, validate: true });

      // 2. Create student record
      await db.students.create({
        rollNo: data.rollNo,
        firstName: data.firstName,
        lastName: data.lastName,
        year: data.year,
        email: data.email,
        courseId: data.courseId,
        hostelNo: hostelNo,
      }, { transaction, validate: true });

      // 3. Create profile with validated data
      const profileData = {
        rollNo: data.rollNo,
        bloodGroup: data.bloodGroup,
        identificationMark: data.identificationMark,
        gender: data.gender,
        pEmail: data.pEmail,
        subAddress: data.subAddress,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        contactNumber: data.contactNumber,
        secondaryContact: data.secondaryContact,
        phoneNumber: data.phoneNumber,
        fatherName: data.fatherName,
        fatherContact: data.fatherContact,
        fatherOccupation: data.fatherOccupation,
        motherName: data.motherName,
        motherContact: data.motherContact,
        motherOccupation: data.motherOccupation,
        dob: data.dob,
        addharNumber: data.addharNumber,
        photoLink: data.photoLink,
        aadharCardDocument: data.aadharCardDocument,
        localGuardian: data.localGuardian,
        localGuardianContact: data.localGuardianContact,
        localGuardianAddress: data.localGuardianAddress
      };

      await db.profiles.create(profileData, { transaction, validate: true });

      // 4. Create bank details
      await db.bankdetails.create({
        rollNo: data.rollNo,
        accHolderName: data.accHolderName,
        bankName: data.bankName,
        accNumber: data.accNumber,
        IFSC: data.IFSC,
      }, { transaction, validate: true });

      await transaction.commit();
      return { message: "success", ...data };
    } catch (error) {
      await transaction.rollback();
      console.error("Error in transaction:", error);
      throw error;
    }
  } catch (err) {
    return { message: err.message, ...data };
  }
}

function validateJsonData(jsonData, requiredAttributes) {
  if (!jsonData || !jsonData.length) {
    throw new Error("No data provided in CSV");
  }

  const item = jsonData[0];
  const jsonKeys = Object.keys(item);

  // Check for missing required fields
  const missingKeys = requiredAttributes.filter(attr => !jsonKeys.includes(attr));
  if (missingKeys.length > 0) {
    throw new Error(`CSV did not match with given template. Missing: ${missingKeys.join(", ")}`);
  }

  // Check for unexpected fields
  const extraKeys = jsonKeys.filter(attr => !requiredAttributes.includes(attr));
  if (extraKeys.length > 0) {
    throw new Error(`CSV did not match with given template. Unexpected: ${extraKeys.join(", ")}`);
  }

  // Validate data formats
  jsonData.forEach((row, index) => {
    // Phone number validations
    if (!/^[0-9]{10,12}$/.test(row.phoneNumber)) {
      throw new Error(`Row ${index + 1}: phoneNumber must be 10-12 digits`);
    }
    if (!/^[0-9]{10}$/.test(row.contactNumber)) {
      throw new Error(`Row ${index + 1}: contactNumber must be exactly 10 digits`);
    }
    if (!/^[6-9][0-9]{9}$/.test(row.localGuardianContact)) {
      throw new Error(`Row ${index + 1}: localGuardianContact must be 10 digits starting with 6-9`);
    }
    if (!/^[0-9]{12}$/.test(row.addharNumber)) {
      throw new Error(`Row ${index + 1}: addharNumber must be exactly 12 digits`);
    }
    
    // Email validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) {
      throw new Error(`Row ${index + 1}: Invalid email format`);
    }
    if (!emailRegex.test(row.pEmail)) {
      throw new Error(`Row ${index + 1}: Invalid parent email format`);
    }
  });
}

exports.bulkCreateController = async (req, res) => {
    try {
      console.log('=== Bulk Create Controller Debug ===');
      console.log('1. Request token data:', req.tokenData);
      
      // Get hostel number from token data
      const hostelNo = req.tokenData?.hostelNo;
      console.log('2. Extracted hostelNo:', hostelNo);
      
      if (!hostelNo) {
        console.log('3. Error: No hostelNo found');
        return res.status(401).json("Unauthorized: Hostel number not found in token");
      }

      //? get json data from body
      const jsonObj = req.body.data;
      console.log('4. CSV data received:', jsonObj ? 'Yes (length: ' + jsonObj.length + ')' : 'No');
      
      const requiredAttributes = [
        "rollNo", "firstName", "lastName", "year", "email",
        "bloodGroup", "identificationMark", "gender", "pEmail", "subAddress",
        "city", "state", "pinCode", "contactNumber", "secondaryContact",
        "phoneNumber", "fatherName", "fatherContact", "fatherOccupation",
        "motherName", "motherContact", "motherOccupation",
        "dob", "addharNumber",
        "photoLink", "aadharCardDocument",
        "localGuardian", "localGuardianContact", "localGuardianAddress",
        "accHolderName", "bankName", "accNumber", "IFSC",
        "courseId"
      ];
        
      // Validate JSON data
      validateJsonData(jsonObj, requiredAttributes);
      let finalWithErrors = [];
      let theseEnteredInDB = [];

      const { duplicates, unique } = filterDuplicates(jsonObj);
      finalWithErrors = [...duplicates];

      //? get all students data from db
      const alldb = await db.students.findAll({
        attributes: ['rollNo', 'email']
      });
        
      let inputData = [];

      //?code to seperate insertpayload and update
      unique.forEach((item) => {
        const exists = alldb.some((student) => {
          return student.rollNo == item.rollNo || student.email == item.email;
        });   
        if (exists) {
          finalWithErrors.push({message: "already Exists in database", ...item});
        } else {
          inputData.push(item);
        }
      });

      //*transaction
      try {
        const results = await Promise.all(
          inputData.map((entry) => uploadStudents(entry, hostelNo))
        );

        results.forEach((result) => {
          if (result.message === "success") {
            theseEnteredInDB.push(result);
          } else {
            finalWithErrors.push(result);
          }
        });
        console.log('Bulk upload successful');
      } catch (error) {
        console.error('Error during bulk upload:', error.message);
      }
      return res.status(200).json([theseEnteredInDB, finalWithErrors]);
    } catch (err) {
      res.status(500).json(err + "");
    }
  }

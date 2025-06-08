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

async function uploadStudents(data, hostelNo){
  try {
    const transaction = await db.sequelize.transaction();
    try {
      const salt = await bcrypt.genSalt(10);
      const password = data.contactNumber !== undefined ? String(data.contactNumber) : String(data.rollNo);
      const securePassword = await bcrypt.hash(password, salt);

      await db.users.create({
        email: data.email,
        password: securePassword,
        role: 'Student',
      }, { transaction, validate: true });

      await db.students.create({
        rollNo: data.rollNo,
        firstName: data.firstName,
        lastName: data.lastName,
        year: data.year,
        email: data.email,
        courseId: data.courseId,
        hostelNo: hostelNo,    // Now this works without ReferenceError
      }, { transaction, validate: true });

      await db.profiles.create({
        ...data,
        rollNo: data.rollNo,
      }, { transaction, validate: true });

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
  const item = jsonData[0];
  const jsonKeys = Object.keys(item);

  const missingKeys = requiredAttributes.filter(attr => !jsonKeys.includes(attr));
  if (missingKeys.length > 0) {
    throw new Error(`CSV did not match with given template. Missing: ${missingKeys.join(", ")}`);
  }

  const extraKeys = jsonKeys.filter(attr => !requiredAttributes.includes(attr));
  if (extraKeys.length > 0) {
    throw new Error(`CSV did not match with given template. Unexpected: ${extraKeys.join(", ")}`);
  }
}


exports.bulkCreateController = async (req, res) => {
    try {
      // console.log("THis is request body : ", req.body.hostelNo);
      //? get json data from body
        const jsonObj = req.body.data;
        const emailAdmin=req.body.email;
        const hostelNo = req.body.hostelNo;
        const requiredAttributes = [
          "rollNo", "firstName", "lastName", "year", "email",
          "bloodGroup", "identificationMark", "gender", "pEmail", "subAddress",
          "city", "state", "pinCode", "contactNumber", "secondaryContact",
          "phoneNumber", "fatherName", "fatherContact", "fatherOccupation",
          "motherName", "motherContact", "motherOccupation",
          "dob", "addharNumber",
          "photoLink", "aadharCardDocument", // <- new
          "localGuardian", "localGuardianContact", "localGuardianAddress", // <- new
          "accHolderName", "bankName", "accNumber", "IFSC",
          "courseId"
        ];
        
        // Validate JSON data
        validateJsonData(jsonObj, requiredAttributes);
        let finalWithErrors=[];
        let theseEnteredInDB=[];

        //* if there are rows having same rollNo or email it will puth them into 
        //* duplicates and unique ones in unique

        const { duplicates, unique } = filterDuplicates(jsonObj);
        finalWithErrors=[...duplicates];

        //? get all students data from db
        //?here we will no do hostel wize for case if students reg. by other hostel 
        //?he will be req. again so check for whole db
        const alldb= await db.students.findAll({
          attributes: ['rollNo', 'email']
        });
        
        let inputData = [];

        //?code to seperate insertpayload and update
        unique.forEach((item) => {
          const exists = alldb.some((student) => {
            return student.rollNo == item.rollNo || student.email == item.email;
          });   
          if (exists) {
            finalWithErrors.push({message:"already Exists in database",...item});
          } else {
            inputData.push(item);
          }
        });

         //*transaction
         try {
          const results = await Promise.all(
            inputData.map((entry) => uploadStudents(entry,emailAdmin, hostelNo))
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
        return res.status(200).json([theseEnteredInDB,finalWithErrors]);
    } catch (err) {
        res.status(500).json(err + "");
    }
  }
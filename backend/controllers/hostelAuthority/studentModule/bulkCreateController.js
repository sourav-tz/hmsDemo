const db = require('../../../models/index')
const bcrypt = require('bcrypt')
function filterDuplicates(array) {
  const duplicates = [];
  const unique = array.filter((student) => {
    const isDuplicate = array.filter(
      (existingStudent) =>
        existingStudent.email === student.email || existingStudent.rollNo === student.rollNo
    ).length;
    if (isDuplicate>1) {
      duplicates.push({message:"Email or rollNo common with other entry in CSV",...student});
    }
    return isDuplicate <= 1;
  });

  return { duplicates, unique };
}
async function uploadStudents(data,emailAdmin){
  try {
    const transaction = await db.sequelize.transaction();
    try {
      //*it have been allready checked that user exits or not in previous step
      //* so no need to check again here
      const salt = await bcrypt.genSalt(10)
      const password=data.contactNumber !== undefined ? String(data.contactNumber) : String(data.rollNo);
      const securePassword = await bcrypt.hash(password, salt)
      await db.users.create({
        email: data.email,
        password: securePassword,
        role: 'Student',
      },{transaction,validate:true});

      await db.students.create({
              rollNo: data.rollNo,
              firstName: data.firstName,
              lastName: data.lastName,
              year: data.year,
              email: data.email,
              courseId: data.courseId,
              hostelNo:data.hostelNo,
              roomId:data.roomId,
       }, { transaction, validate: true });
       
       await db.profiles.create({
        ...data,
        rollNo: data.rollNo,
       },{transaction,validate: true});

       await db.bankdetails.create({
              rollNo:data.rollNo,
              accHolderName: data.accHolderName,
              bankName: data.bankName,
              accNumber: data.accNumber,
              IFSC: data.IFSC,
       },{transaction,validate: true});

      await transaction.commit();
      return {message:"success",...data};
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      console.error("Error in transaction:", error);
      throw error; // Rethrow the error to handle it in the outer catch block
    }
   } catch (err) {
    return {message:err.message,...data};
   }
}
function validateJsonData(jsonData, requiredAttributes) {
  const item = jsonData[0];
  let jsonKeys = Object.keys(item);
  jsonKeys = jsonKeys.slice(0, requiredAttributes.length);
  console.log(jsonKeys);
  console.log(jsonKeys.length);
  console.log(' '+requiredAttributes.length);
    // Convert the requiredAttributes array to a set
  const attributeSet = new Set(requiredAttributes);

    // Check if the sizes of the sets are equal
    if (jsonKeys.length !== attributeSet.size) {
      throw new Error(`CSV did not match with given Template`);
      
    }
    
    // Check if all keys in jsonData are also in attributes
    for (const key of jsonKeys) {
      if (!attributeSet.has(key)) {
        throw new Error(`CSV did not match with given Template. wrong attribute is ${key}`);
        }
    }
}

exports.bulkCreateController = async (req, res) => {
    try {
      //? get json data from body
        const jsonObj = req.body.data;
        // const hostelNo = req.body.hostelNo;
        const requiredAttributes = ["rollNo","firstName","lastName","year","email",
                                  "bloodGroup","identificationMark","gender","pEmail","subAddress",
                                  "city","state","pinCode","contactNumber","secondaryContact","fatherName",
                                  "fatherContact","fatherOccupation","motherName","motherContact","motherOccupation",
                                   "dob","addharNumber","accHolderName","bankName","accNumber","IFSC","courseId","hostelNo","roomId"];

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
            inputData.map((entry) => uploadStudents(entry,emailAdmin))
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
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
async function uploadStudents(data){
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
        role: 'student',
        lastUpdatedBy: 'your_last_updated_by_value',
      },{transaction,validate:true});

      await db.students.create({
              rollNo: data.rollNo,
              firstName: data.firstName,
              lastName: data.lastName,
              year: data.year,
              email: data.email,
              lastUpdatedBy: 'your_last_updated_by_value',
              courseId: data.courseId,
              hostelNo:data.hostelNo,
       }, { transaction, validate: true });
       
       await db.profiles.create({
        ...data,
        rollNo: data.rollNo,
        lastUpdatedBy: 'your_last_updated_by_value',
       },{transaction,validate: true});

       await db.bankdetails.create({
              rollNo:data.rollNo,
              accHolderName: data.accHolderName,
              bankName: data.bankName,
              accNumber: data.accNumber,
              IFSC: data.IFSC,
              lastUpdatedBy: 'your_last_updated_by_value',
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
  const jsonKeys = Object.keys(item);
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
        const jsonObj = req.body;
        const requiredAttributes = ["rollNo","firstName","lastName","year","email",
                                  "bloodGroup","identificationMark","gender","pEmail","subAddress",
                                  "city","state","pinCode","contactNumber","secondaryContact","fatherName",
                                  "fatherContact","fatherOccupation","motherName","motherContact","motherOccupation",
                                   "dob","addharNumber","accHolderName","bankName","accNumber","IFSC"];

        // Validate JSON data
        validateJsonData(jsonObj, requiredAttributes);
        let finalWithErrors=[];
        let theseEnteredInDB=[];

        //* if there are rows having same rollNo or email it will puth them into 
        //* duplicates and unique ones in unique

        const { duplicates, unique } = filterDuplicates(jsonObj);
        finalWithErrors=[...duplicates];

        //? get all students data from db
        const alldb= await db.students.findAll();
        
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
          // for (const entry of inputData) {
          //   const result = await uploadStudents(
          //     entry);
      
          //   // Collect the result of each transaction
          //   if(result.message =="success"){
          //     theseEnteredInDB.push(result);
          //   }else{
          //     finalWithErrors.push(result);
          //   }
          // }
          const results = await Promise.all(
            inputData.map((entry) => uploadStudents(entry))
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
        return res.json([theseEnteredInDB,finalWithErrors]);
    } catch (err) {
        res.json(err + "");
    }
  }
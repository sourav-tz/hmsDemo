const db = require('../../../models/index')


exports.bulkCreateController = async (req, res) => {
    try {
      //? get json data from body
        const jsonObj = req.body;
        

        //? get all students data from db
        const alldb= await db.students.findAll();
        
        let inputData = [];
        let update = [];
    
        //?code to seperate insertpayload and update
        jsonObj.forEach((item, index) => {
          const exists = alldb.some((student) => {
            return student.rollNo == item.rollNo || student.email == item.email;
          });   
          if (exists) {
            update.push(item);
          } else {
            inputData.push(item);
          }
        });


      try {
        // Start the transaction
        const transaction = await db.sequelize.transaction();
      
        try {
          // Create users
          const usersData = inputData.map((data) => ({
            email: data.email,
            password: data.contactNumber !== undefined ? String(data.contactNumber) : data.rollNo,
            role: 'student',
            lastUpdatedBy: 'your_last_updated_by_value',
          }));
      
          const insertedUsers = await db.users.bulkCreate(usersData, { transaction, validate: true });
      
          // Insert students
          const insertedStudents = await db.students.bulkCreate(inputData.map((data, index) => ({
            rollNo: data.rollNo,
            firstName: data.firstName,
            lastName: data.lastName,
            year: data.year,
            email: insertedUsers[index].email,
            lastUpdatedBy: 'your_last_updated_by_value',
            courseId: data.courseId,
            hostelNo:data.hostelNo,
          })), { transaction, validate: true });
      
          // Insert profiles
          const profilesData = inputData.map((data, index) => ({
            ...data,
            rollNo: insertedStudents[index].rollNo,
            lastUpdatedBy: 'your_last_updated_by_value',
          }));
      
          await db.profiles.bulkCreate(profilesData, { transaction, validate: true });
      
          // Insert bankdetails
          const bankdetailsData = inputData.map((data, index) => ({
            rollNo: insertedStudents[index].rollNo,
            accHolderName: data.accHolderName,
            bankName: data.bankName,
            accNumber: data.accNumber,
            IFSC: data.IFSC,
            lastUpdatedBy: 'your_last_updated_by_value',
          }));
      
          await db.bankdetails.bulkCreate(bankdetailsData, { transaction, validate: true });
      
          // Commit the transaction
          await transaction.commit();
      
          return res.json([inputData, update]);
        } catch (error) {
          // Rollback the transaction on error
          await transaction.rollback();
          console.error("Error in transaction:", error);
          throw error; // Rethrow the error to handle it in the outer catch block
        }
      } catch (error) {
        console.log("Outer catch block:", error);
        return res.send(error);
      }
      
    } catch (err) {
        res.json(err + "");
    }
  }








   //  try {
      //     //? Using transactions to ensure data consistency
      //     db.sequelize.transaction(async (t) => {
      //        try {
      //          // Create users
      //          const usersData = inputData.map((data) => ({
      //           email: data.email, // Assuming email is provided in the input data
      //           password: data.contactNumber!=undefined ? ('' + data.contactNumber): data.rollNo, // Update with the actual value or generate a password
      //           role: 'student', // Update with the actual role
      //           lastUpdatedBy: 'your_last_updated_by_value', // Update with the actual value
      //         }));
      //         let  insertedUsers;
      //            insertedUsers = await db.users.bulkCreate(usersData, { transaction: t ,validate:true});
      //        console.log("user done");
      //         // Insert students
      //           var insertedStudents = await db.students.bulkCreate(inputData.map((data,index) => ({
      //             rollNo: data.rollNo,
      //             firstName: data.firstName,
      //             lastName: data.lastName,
      //             year: data.year,
      //             email: insertedUsers[index].email,
      //             lastUpdatedBy: 'your_last_updated_by_value', 
      //           })), { transaction: t,validate: true });
  
      //           console.log("student done");
      //             // Insert profiles
      //             const profilesData = inputData.map((data, index) => ({
      //               ...data,
      //               rollNo: insertedStudents[index].rollNo,
      //               lastUpdatedBy: 'your_last_updated_by_value', 
      //             }));
      //             console.log("pro se ");
      //               await db.profiles.bulkCreate(profilesData, { transaction: t,validate: true });
      //               console.log("profile done");
      //             // Insert bankdetails
      //             const bankdetailsData = inputData.map((data, index) => ({
      //               rollNo: insertedStudents[index].rollNo,
      //               accHolderName: data.accHolderName,
      //               bankName: data.bankName,
      //               accNumber: data.accNumber,
      //               IFSC: data.IFSC,
      //               lastUpdatedBy: 'your_last_updated_by_value', // Update with the actual value
      //             }));
  
      //               await db.bankdetails.bulkCreate(bankdetailsData, { transaction: t,validate: true });
      //             return res.json([inputData,update]);
      //        } catch (error) {
      //         console.error("Error in transaction:", error);
      //         throw error; // Rethrow the error to handle it in the outer catch block
      //        }
      //     }); 
      //  } catch (error) {
      //   console.log("hello")
      //   return res.send("yo");
      //  }
const db = require('../../../models/index')

exports.singleStudentUpload=async (req,res)=>{
    try {
          //? get json data from body
          const data = req.body;
    
        const studentData = await db.students.findOne({
          where: { rollNo:data.rollNo ,email:data.email}
        });
    
        //if student Already exists
        if (studentData) {
          return res.status(404).json({ error: 'Student allready exists' });
        }
        try {
            // Start the transaction
            const transaction = await db.sequelize.transaction();
          
            try {
              // Create users
              const usersData = {
                email: data.email,
                password: data.contactNumber !== undefined ? String(data.contactNumber) : data.rollNo,
                role: 'student',
                lastUpdatedBy: 'deepak@gmail.com',
              };
          
              const insertedUsers = await db.users.create(usersData, { transaction, validate: true });
          
              // Insert students
              const insertedStudents = await db.students.create({
                rollNo: data.rollNo,
                firstName: data.firstName,
                lastName: data.lastName,
                year: data.year,
                email: insertedUsers.email,
                lastUpdatedBy: 'deepak@gmail.com',
                courseId: data.courseId, // given using dropdown
                // hostelNo:data.hostelNo, it will be at the time of room allotment
              }, { transaction, validate: true });
          
              // Insert profiles
              const profilesData = {
                ...data,
                rollNo: insertedStudents.rollNo,
                lastUpdatedBy: 'deepak@gmail.com',
              };
          
              await db.profiles.create(profilesData, { transaction, validate: true });
          
              // Insert bankdetails
              const bankdetailsData = {
                rollNo: insertedStudents.rollNo,
                accHolderName: data.accHolderName,
                bankName: data.bankName,
                accNumber: data.accNumber,
                IFSC: data.IFSC,
                lastUpdatedBy: 'deepak@gmail.com',
              };
          
              await db.bankdetails.create(bankdetailsData, { transaction, validate: true });
          
              // Commit the transaction
              await transaction.commit();
          
              return res.json(data);
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
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error:error });
      }
};
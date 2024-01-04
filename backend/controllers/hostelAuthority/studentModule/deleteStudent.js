const db = require('../../../models/index')

exports.deleteStudent=async (req,res)=>{
    try {
      const {rollNo,email}=req.body;
      console.log(rollNo)
      const ifexists=await db.students.findOne({
        where:{rollNo:rollNo}
      });
      if(!ifexists){
        return res.json({msg:"student does not exist"});
      }
      try {
        // Start the transaction
        const transaction = await db.sequelize.transaction();
      
        try {
          // delete from user
          const userDelete=await db.users.destroy({where:{email}},{transaction});
          if(userDelete==0){
            throw "User email did exists or match";
          }
          //delete from students
          const studentDelete=await db.students.destroy({where:{rollNo}},{transaction});
          if(studentDelete==0){
            throw "Student did exists or rollNo did not match";
          }
          return res.json({msg:"student deleted successfully"});
        } catch (error) {
          // Rollback the transaction on error
          await transaction.rollback();
          console.error("Error in transaction:", error);
          throw error; // Rethrow the error to handle it in the outer catch block
        }
      } catch (error) {
        console.log("Outer catch block:", error);
        return res.json({error});
      }
      } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};
const db = require('../../../models/index')

async function updateStudents(data) {
 try {
  const transaction = await db.sequelize.transaction();
  try {
    // Find the user by its email
    
    const user=await db.users.findOne({
      where:{
        email:data.email
      }
    });
    //is user is present then update
    if(user){
        await db.users.update(data,{
      where:{
        email:data.email
      }
     },{transaction});
    }else{
      throw new Error('Email not found in database'); 
    }
    // find student by rollNo
    const student= await db.students.findOne({
      where:{
        rollNo:data.rollNo
      }
    });
    //if present then update values
    if(student){
        await db.students.update(data,{
        where:{
          rollNo:data.rollNo
        }
      },{
        transaction
      });
        await db.profiles.update(data,{
        where:{
          rollNo:data.rollNo
        }
      },{
        transaction
      });
        await db.bankdetails.update(data,{
        where:{
          rollNo:data.rollNo
        }
      },{
        transaction
      });
    }else{
      throw new Error('rollNo not found in database'); 
    }
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
exports.updateBulk = async (req, res) => {
    try {
      //? get json data from body
        const jsonObj = req.body;
        let finalWithErrors=[];
        let theseEnteredInDB=[];
        try {
          const results=await Promise.all(
            jsonObj.map((update)=>updateStudents(update))
          );
          results.forEach((result)=>{
            if (result.message === "success") {
              theseEnteredInDB.push(result);
            } else {
              finalWithErrors.push(result);
            } 
          })
          console.log('Bulk update successful');
        } catch (error) {
          console.error('Error during bulk update:', error.message);
          return res.status(400).json(err + "");
        }
     return res.status(200).json([theseEnteredInDB,finalWithErrors]);      
    } catch (err) {
        return res.status(500).json(err + "");
    }
  }

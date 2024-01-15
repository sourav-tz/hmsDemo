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
    }
    await transaction.commit();
    return {message:"success",data:data};
  } catch (error) {
    // Rollback the transaction on error
    await transaction.rollback();
    console.error("Error in transaction:", error);
    throw error; // Rethrow the error to handle it in the outer catch block
  }
 } catch (err) {
  return {error:err.message,data:data};
 }
}
exports.updateBulk = async (req, res) => {
    try {
      //? get json data from body
        const jsonObj = req.body;
        console.log(jsonObj);
        const results=[];
        try {
          // Iterate through each book update
          for (const update of jsonObj) {
            const result = await updateStudents(
              update);
      
            // Collect the result of each transaction
            results.push(result);
          }
          console.log('Bulk update successful');
        } catch (error) {
          console.error('Error during bulk update:', error.message);
        }
     return res.json({
      result:results
     });      
    } catch (err) {
        return res.json(err + "");
    }
  }

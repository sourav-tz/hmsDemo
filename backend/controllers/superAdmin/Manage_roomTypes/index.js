const db = require('../../../models/index')


//?  in roomtype table add,update,remove
//*add,remove
//* we need a default room type too

const getRoomTypes=async (req,res)=>{
  try {
    const result=await db.roomtypes.findAll();
    return res.status(200).json({result:result});
  } catch (error) {
    return res.status(500).json({error:error})
  }
}
const addRoomType=async (req, res) => {
    try {
       //? get json data from body
       const {type,facilities} = req.body;
       const nameAlreadyExists=await db.roomtypes.findOne({
        where:{type:type}
       });
       if(nameAlreadyExists) {
        return res.status(404).json({message:"RoomType already exists"});
       }
       const payload = {
        type,
        facilities,
        lastUpdatedBy: 'deepak@gmail.com',
      }
  
      const insertedRoomType = await db.roomtypes.create(payload);
      return res.status(200).json({insertedRoomType});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }
const deleteRoomType=async (req, res) => {
    try {
       //? get json data from body
       const {roomTypeNo} = req.body;
       await db.roomtypes.destroy({
        where:{
          roomTypeNo
        }
      });
      return res.status(200).json({message:"Successfully deleted"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  }

  module.exports={
    addRoomType,deleteRoomType,getRoomTypes
  }





const db = require('../../../models/index')

const getrooms=async (req, res) => {
  try {
    let result= await db.rooms.findAll({});
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
const addroom=async (req,res)=>{
    try {
        const {roomNo,block,floorNo,maxOccupancy,hostelNo}=req.body;
        const alreadyExists= await db.rooms.findOne({
            where:{hostelNo,roomNo,block,floorNo}
        });
        if(alreadyExists){
            return res.status(400).json({message:"this room already exists"});
        }
        const newRoom= await db.rooms.create({roomNo,block,floorNo,currentOccupancy:"vacant",maxOccupancy,hostelNo})
      return res.status(200).json({messgae:"Rooms Added Successfully",data:newRoom});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
};
const updateroom = async (req,res)=>{
    try {
        const {maxOccupancy,roomId}=req.body;
        const updated=await db.rooms.update({maxOccupancy:maxOccupancy},{
            where:{roomId},
        });
        
        if(!updated){
          return res.status(400).json({message:"room not found"});
        }
      return res.status(200).json({message:"room capacity updated"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const deleteroom = async (req,res)=>{
    try {
        const {roomId}=req.body;
        const deleted=await db.rooms.destroy({
            where:{roomId},
        });
        if(!deleted){
          return res.status(400).json({message:"room not found"});
        }
      return res.status(200).json({message:"room Successfully deleted"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}

module.exports={
    getrooms,addroom,updateroom,deleteroom
}
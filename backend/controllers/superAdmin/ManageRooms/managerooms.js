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
        const {roomNo,block,maxOccupancy,hostelNo}=req.body;
        // Bug fix by Ravi: Bug 19 - Floor must be manually entered; auto-derive floorNo from roomNo (1XX→0, 2XX→1, 3XX→2, etc.)
        let { floorNo } = req.body;
        if (!floorNo && roomNo) {
            const prefix = Math.floor(Number(roomNo) / 100);
            floorNo = prefix > 0 ? prefix - 1 : 0;
        }
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

// Bug fix by Ravi: Bug 4 - Super Admin had no way to view total/occupied/available capacity per hostel
const getHostelCapacitySummary = async (req, res) => {
    try {
        const rooms = await db.rooms.findAll({});
        const summary = {};
        rooms.forEach(r => {
            if (!summary[r.hostelNo]) summary[r.hostelNo] = { total: 0, occupied: 0, vacant: 0 };
            summary[r.hostelNo].total += Number(r.maxOccupancy) || 0;
            if (r.currentOccupancy === 'vacant') {
                summary[r.hostelNo].vacant += 1;
            } else {
                summary[r.hostelNo].occupied += 1;
            }
        });
        return res.status(200).json({ success: true, result: summary });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports={
    getrooms, addroom, updateroom, deleteroom, getHostelCapacitySummary
}
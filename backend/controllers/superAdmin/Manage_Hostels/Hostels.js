const db = require('../../../models/index')
//* read 
//* add
//* softdelete (disable)
//* permanent delete (can only delete if mistakenly added) it will be resticted if hostels student exists
//* enable hostels (if in res softdelete attribute is not null then show row as disabled )
//*update 

const getHostels=async (req, res) => {
  try {
    let data= await db.hostels.findAll({
        paranoid:false,
        include: [
          {
            model: db.hostelauthoritys,
          },
        ]
    });
    const result=data.map((key)=>(key.dataValues.deletedAt)?{...key.dataValues,active:false}:{...key.dataValues,active:true});
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
const addHostel=async (req,res)=>{
    try {
        const {newHostelNo,hostelName,type,email}=req.body;
        const alreadyExists= await db.hostels.findOne({
            where:{hostelNo:newHostelNo},paranoid:false
        });
        if(alreadyExists){
            return res.status(400).json({message:"hostel already exists"});
        }
        const hostelCreated= await db.hostels.create({hostelNo:newHostelNo,hostelName,type,
            lastUpdatedBy:email
        })
      return res.status(200).json({messgae:"Hostel Added Successfully",data:hostelCreated});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
};
const removeHostel = async (req,res)=>{
    try {
        const hostelNo = req.query.hostelNo;
        const softdelete=req.query.softdelete=="true";
        const deleted=await db.hostels.destroy({
            where:{hostelNo},
            force:softdelete
        });
        if(!deleted){
          return res.status(400).json({message:"Hostel not found"});
        }
      return res.status(200).json({message:"Hostel Successfully deleted"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const enableHostel = async (req,res)=>{
    try {
        const {bodyHostelNo} = req.body;
        const enabled=await db.hostels.restore({
            where:{hostelNo:bodyHostelNo}
        });
        if(!enabled){

          return res.status(400).json({messgae:"Not Found or already enabled"});
        }
      return res.status(200).json({messgae:"Successfully Enabled"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const updateHostel=async (req, res) => {
  try {
    const {bodyHostelNo,hostelName,type} = req.body;
    const isHostelPresent=await db.hostels.findOne({
      where:{
        hostelNo:bodyHostelNo
      }
    });
    if(!isHostelPresent) {
      return res.status(400).json({message:"Given Hostel Not Found"});
    }
    const data={};
    if(hostelName)data.hostelName=hostelName;
    if(type)data.type=type;
    await db.hostels.update(data,{
        where:{hostelNo:bodyHostelNo}
    });
  return res.status(200).json({message:"successfully Updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

const getAdminsAgainstHostel = async (req, res) => {

  const {hostelNo} = req.body;
  console.log('called')
  try {
    let data= await db.hostelauthoritys.findAll({
        where:{hostelNo}});
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}


module.exports={
  getHostels,addHostel,removeHostel,enableHostel,updateHostel,getAdminsAgainstHostel
}
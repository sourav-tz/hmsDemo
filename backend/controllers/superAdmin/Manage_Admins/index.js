const db = require('../../../models/index')

//* manage admin [revoke login , give login again ,change hostel]
//* provide all admins (get request for table)
//*  login acess ke lie enable disable 
//* change hostel (for now just update in HA table but we need to store transaction history)


const getAdmins=async (req, res) => {
  try {
    const data = await db.users.findAll({
      paranoid:false,
      where:{
        role:'Hostel-Authority'
      },
      include: [{
          model: db.hostelauthoritys,
      }]
  });
    const result=data.map((key)=>{
      return ((key.dataValues.deletedAt)?{...(key.dataValues.hostelauthority.dataValues),active:false}:{...(key.dataValues.hostelauthority.dataValues),active:true})
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error in getAdmins Controller"});
  }
}


const revokeLoginAcess = async (req,res)=>{
    try {
        const {emailOfHA} = req.body;
        const deleted=await db.users.destroy({
            where:{email:emailOfHA}
        });
        if(!deleted){
          return res.status(400).json({message:"Email not found or allready revoked access"});
        }
      return res.status(200).json({message:"Successfull revoked access"});
      } catch (error) {
        return res.status(500).json({message:"Internal Server Error in RevokeLoginAccess Controller"});
      }
}


const giveLoginAccess = async (req,res)=>{
    try {
        const {emailOfHA} = req.body;
        const enabled=await db.users.restore({
            where:{email:emailOfHA}
        });
      if(!enabled){
        return res.status(400).json({message:"Email not found or allread granted access"});
      }
      return res.status(200).json({message:"successfully granted login access"});
      } catch (error) {
        return res.status(500).json({message:"Internal Server Error in GiveLoginAccess Controller"});
      }
}



const changeHostel=async (req,res)=>{
    try {
        const {emailOfHA,newHostelNo} = req.body;
        const isHostelPresent=await db.hostels.findOne({
          where:{
            hostelNo:newHostelNo
          }
        });
        if(!isHostelPresent) {
          return res.status(400).json({message:"Given Hostel Not Found"});
        }
        await db.hostelauthoritys.update({hostelNo:newHostelNo},{
            where:{email:emailOfHA}
        });
      return res.status(200).json({message:`Hostel changed to ${newHostelNo}`});
      } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error in ChangeHostel Controller"});
      }
}

const deleteAdmin=async (req,res)=>{
  try{
    const {email}=req.body;
    const deleted=await db.users.destroy({
      where:{email:email},
    });
    const deletedHA=await db.hostelauthoritys.destroy({
      where:{email:email},
    });
    if(!deleted && !deletedHA){
      return res.status(400).json({message:"Email not found or allready deleted"});
    }
    return res.status(200).json({message:"Successfully deleted"});
  }
  catch(error){
    return res.status(500).json({message:"Internal Server Error in DeleteAdmin Controller"});
  }
}


module.exports={
  getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel,deleteAdmin
}
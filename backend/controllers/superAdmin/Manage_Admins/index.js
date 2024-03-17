const db = require('../../../models/index')

//Todo manage admin [revoke login , give login again ,change hostel]
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
    return res.json(result);
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error in getAdmins Controller"});
  }
}


const revokeLoginAcess = async (req,res)=>{
    try {
        const {email} = req.body;
        const deleted=await db.users.destroy({
            where:{email:email}
        });
      return res.json({data:deleted});
      } catch (error) {
        return res.status(500).json({message:"Internal Server Error in RevokeLoginAccess Controller"});
      }
}


const giveLoginAccess = async (req,res)=>{
    try {
        const {email} = req.body;
        const enabled=await db.users.restore({
            where:{email:email}
        });
      return res.json({data:enabled});
      } catch (error) {
        return res.status(500).json({message:"Internal Server Error in GiveLoginAccess Controller"});
      }
}



const changeHostel=async (req,res)=>{
    try {
        const {email,hostelNo} = req.body;
        await db.hostelauthoritys.update({hostelNo},{
            where:{email}
        });
        //Todo add transaction history feature for timeline
      return res.json({message:`Hostel changed to ${hostelNo}`});
      } catch (error) {
        return res.status(500).json({message:"Internal Server Error in ChangeHostel Controller"});
      }
}
module.exports={
  getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel
}
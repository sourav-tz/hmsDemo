const db = require('../../../models/index')

//Todo manage admin [revoke login , give login again ,change hostel]
//* provide all admins (get request for table)
//*  login acess ke lie enable disable 
//* change hostel (for now just update in HA table but we need to store transaction history)


const getAdmins=async (req, res) => {
  try {
    const data = await db.users.findAll({
      paranoid:false,
      include: [{
          model: db.hostelauthoritys,
      }]
  });
    const result=data.map((key)=>(key.dataValues.deletedAt)?{...key.dataValues,active:false}:{...key.dataValues,active:true});
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
const revokeLoginAcess = async (req,res)=>{
    try {
        const {email} = req.body;
        const deleted=await db.users.destroy({
            where:{email},
        });
      return res.json({data:deleted});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const giveLoginAccess = async (req,res)=>{
    try {
        const {email} = req.body;
        const enabled=await db.hostels.restore({
            where:{email}
        });
      return res.json({data:enabled});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const changeHostel=async (req,res)=>{
    try {
        const {email,hostelNo} = req.body;
        await db.hostels.update({hostelNo},{
            where:{email}
        });
        //Todo add transaction history feature for timeline
      return res.json({message:`Hostel changed to ${hostelNo}`});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error ,message:"Internal Server Error"});
      }
}
module.exports={
  getAdmins,revokeLoginAcess,giveLoginAccess,changeHostel
}
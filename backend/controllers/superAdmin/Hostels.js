const db = require('../../models/index')
//* read client should give if needs current hostels or all
//* add
//* softdelete (disable)
//* permanent delete (can only delete if mistakenly added) it will be resticted if hostels student exists
//* enable hostels (if in res softdelete attribute is not null then show row as disabled )
//*update 

const getHostels=async (req, res) => {
  try {
    const para = req.params.paranoid =="true";
    let data= await db.hostels.findAll({
        paranoid:para
    });
    const result=data.map((key)=>(key.dataValues.deletedAt)?{...key.dataValues,active:false}:{...key.dataValues,active:true});
    return res.json({data:result});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
const addHostel=async (req,res)=>{
    try {
        const hostel=req.body;
        const alreadyExists= await db.hostels.findOne({
            where:{hostelNo:hostel.hostelNo},paranoid:false
        });
        if(alreadyExists){
            return res.json({msg:"hostel already exists"});
        }
        const hostelCreated= await db.hostels.create({...hostel,
            lastUpdatedBy:"deepak@gmail.com"
        })
      return res.json({data:hostelCreated});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
};
const removeHostel = async (req,res)=>{
    try {
        const {hostelNo,softdelete} = req.body;
        const deleted=await db.hostels.destroy({
            where:{hostelNo},
            force:softdelete
        });
      return res.json({data:deleted});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const enableHostel = async (req,res)=>{
    try {
        const {hostelNo} = req.body;
        const enabled=await db.hostels.restore({
            where:{hostelNo}
        });
      return res.json({data:enabled});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const updateHostel=async (req, res) => {
  try {
    const data = req.body;
    const updated=await db.hostels.update(data,{
        where:{hostelNo:data.hostelNo}
    });
  return res.json({data:updated});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
module.exports={
  getHostels,addHostel,removeHostel,enableHostel,updateHostel
}
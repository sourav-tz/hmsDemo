const db = require('../../models/index')
//* read client should give if needs current courses or all
//* add
//* softdelete (disable)
//* permanent delete (can only delete if mistakenly added) it will be resticted if course student exists
//* enable course (if in res softdelete attribute is not null then show row as disabled )
//*update 

const getCourses=async (req, res) => {
  try {
    const data= await db.courses.findAll({
        paranoid:false
    });
    const result=data.map((key)=>(key.dataValues.deletedAt)?{...key.dataValues,active:false}:{...key.dataValues,active:true});
  return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
const addCourse=async (req,res)=>{
    try {
        const course=req.body;
        const alreadyExists= await db.courses.findOne({
            where:course,paranoid:false
        });
        if(alreadyExists){
            return res.json({msg:"course already exists"});
        }
        const courseCreated= await db.courses.create({...course,
            lastUpdatedBy:"deepak@gmail.com"
        })
      return res.json({data:courseCreated});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
};
const removeCourse = async (req,res)=>{
    try {
        const courseId = req.query.courseId;
        const softdelete=req.query.softdelete=="true";
        const deleted=await db.courses.destroy({
            where:{courseId},
            force:softdelete
        });
      return res.json({data:deleted});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const enableCourse = async (req,res)=>{
    try {
        const {courseId} = req.body;
        console.log("courseId");
        console.log(courseId);
        const enabled=await db.courses.restore({
            where:{courseId}
        });
      return res.json({data:enabled});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const updateCourse=async (req, res) => {
  try {
    const data = req.body;
    const updated=await db.courses.update(data,{
        where:{courseId:data.courseId}
    });
  return res.json({data:updated});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
module.exports={
  getCourses,addCourse,removeCourse,enableCourse,updateCourse
}
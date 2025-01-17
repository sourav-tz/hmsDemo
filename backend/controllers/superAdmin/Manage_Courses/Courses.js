const db = require('../../../models/index')
//* read 
//* add
//* softdelete (disable)
//* permanent delete (can only delete if mistakenly added) it will be resticted if course student exists
//* enable course (if in res softdelete attribute is not null then show row as disabled )
//*update 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(
  {
    path: "../../.env"
  }
)


const getCourses=async (req, res) => {
  try {
    const data= await db.courses.findAll({
        paranoid:false
    });
    const result=data.map((key)=>(key.dataValues.deletedAt)?{...key.dataValues,active:false}:{...key.dataValues,active:true});
  return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}
const addCourse=async (req,res)=>{
    try {
        const {courseName,department,specialization,courseDuration}=req.body;
        const filter={};
        const token = req.cookies.hostelAccessToken;
        const {email} = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if(courseName)filter.courseName=courseName;
        if(department)filter.department=department;
        if(specialization)filter.specialization=specialization;
        if(courseDuration)filter.courseDuration=courseDuration;
        const alreadyExists= await db.courses.findOne({
            where:filter,paranoid:false
        });
        if(alreadyExists){
            return res.status(400).json({msg:"course already exists"});
        }
        const courseCreated= await db.courses.create({courseName,department,specialization,courseDuration,
            lastUpdatedBy:email
        })
      return res.status(200).json({data:courseCreated});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
};
const removeCourse = async (req,res)=>{
    try {
        const courseId = req.query.courseId;
        const softdelete=req.query.softdelete=="true";
        const wasPresent= await db.courses.destroy({
            where:{courseId},
            force:softdelete
        });
      if(!wasPresent) {
        return res.status(400).json({message:"course not found"});
      }
      return res.status(200).json({message:"successfully deleted"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const enableCourse = async (req,res)=>{
    try {
        const {courseId} = req.body;
        console.log(req.body);
        const isDeleted=await db.courses.restore({
            where:{courseId}
        });
      return res.status(200).json({message:"successfully enabled"});
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
      }
}
const updateCourse=async (req, res) => {
  try {
    const {courseId,courseName,department,specialization,courseDuration} = req.body;
    const data={};
    if(courseName)data.courseName=courseName;
    if(department)data.department=department;
    if(specialization)data.specialization=specialization;
    if(courseDuration)data.courseDuration=courseDuration;
    const updateData = await db.courses.update(data,{
        where:{courseId:courseId}
    });
  return res.status(200).json({message:"successfully updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
module.exports={
  getCourses,addCourse,removeCourse,enableCourse,updateCourse
}
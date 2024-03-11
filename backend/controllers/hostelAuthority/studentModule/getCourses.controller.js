const db = require('../../../models/index')
//* read 
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


const getSingleCourse = async (req,res) =>{

    try{

        const {courseId} = req.body;
        
        const courseData = await db.courses.findOne({
            where: { courseId: courseId },
          });


          return res.json(courseData);

    }catch (error){
        return res.status(500).json({error:error});

    }

}


  module.exports ={getCourses,getSingleCourse}
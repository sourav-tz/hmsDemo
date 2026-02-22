const db = require('../../../models/index')

exports.singleStudentInfo=async (req,res)=>{
    try {
        const rollNo = req.params.rollNo; 
    
        const studentData = await db.students.findOne({
          where: { rollNo: rollNo },
          include: [
            {
              model: db.profiles,
            },
            {
              model: db.bankdetails,
            },
            {
              model: db.courses,
            },
          ],
        });
    
        if (!studentData) {
          return res.status(404).json({ error: 'Student not found' });
        }
    
        return res.json(studentData);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};
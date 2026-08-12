const db = require('../../../models/index')

exports.singleStudentInfo=async (req,res)=>{
    try {
        const rollNo = Number(req.params.rollNo);
        const currentUser = req.user || req.tokenData || {};

        if (!['Hostel-Authority', 'SuperAdmin'].includes(currentUser.role)) {
          return res.status(403).json({ error: 'You are not allowed to view this student' });
        }
    
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
            {
              model: db.hostels,
            },
            {
              model: db.studentRemarks,
              required: false,
              separate: true,
              order: [['createdAt', 'DESC']],
            },
          ],
        });
    
        if (!studentData) {
          return res.status(404).json({ error: 'Student not found' });
        }

        if (
          currentUser.role === 'Hostel-Authority' &&
          studentData.hostelNo !== currentUser.hostelNo
        ) {
          return res.status(403).json({ error: 'You can only view students in your hostel' });
        }
    
        return res.json(studentData);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};

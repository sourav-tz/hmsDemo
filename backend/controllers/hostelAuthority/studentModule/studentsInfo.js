const db = require('../../../models/index')

exports.studentsInfo=async (req,res)=>{
    try {
      const page=parseInt(req.query.page);
      const limit=parseInt(req.query.limit);
      let totalpages=parseInt(req.query.totalpages);

      const startIndex=(page-1)*limit;

        // Define filters based on query parameters
        const filters = {};
        if (req.query.rollNo) {
          filters.rollNo = req.query.rollNo;
        }
        if (req.query.firstName) {
          filters.firstName = req.query.firstName;
        }
        if (req.query.lastName) {
          filters.lastName = req.query.lastName;
        }
        if (req.query.courseName) {
          filters.courseName = req.query.courseName;
        }
        if(page==1){
           totalpages=Math.ceil((await db.students.count())/limit);
        }
        // Fetch data from the student table based on filters
        const students = await db.students.findAll({
          where: filters,
          offset:startIndex,
          limit:limit
        });
    
        // Return the result
        students.unshift({next:{
          page:page>=totalpages?totalpages:page+1,
          limit:limit,
          totalpages:totalpages
        }});
        students.unshift({previous:{
          page:page-1?page-1:1,
          limit:limit,
          totalpages:totalpages
        }})
        return res.json(students);
      } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
};
const db = require('../../../models/index');
const {Op} = require('sequelize');

exports.studentsInfo = async (req, res) => {
  try {
    // console.log(req.body.hostelNo);
    let page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    let totalpages = parseInt(req.query.total);
    // Define filters based on query parameters
    const filters = {};
    const filtersProfile = {};
    let myQuery={};
    console.log(req.query);
    if (req.query.rollNo) {
      filters.rollNo = req.query.rollNo;
      myQuery.rollNo={ [Op.startsWith]: `${req.query.rollNo}` };

    }
    if (req.query.firstName) {
      filters.firstName = req.query.firstName;
      myQuery.firstName={ [Op.startsWith]: `${req.query.firstName}` };
    }
    if (req.query.lastName) {
      filters.lastName = req.query.lastName;
      myQuery.lastName={ [Op.startsWith]: `${req.query.lastName}` };
    }
    if (req.query.courseId) {
      filters.courseId = req.query.courseId;
      myQuery.courseId={ [Op.startsWith]: `${req.query.courseId}` };
    }
    if (req.query.year) {
      filters.year = req.query.year;
      myQuery.year=req.query.year;
    }
    if (req.query.state) {
      filtersProfile.state = req.query.state;
    }
    if (totalpages == 0) {
      totalpages = Math.ceil((await db.students.count({
        where: filters,
        include: [
          {
            model: db.profiles,
            where: filtersProfile
          }
        ]
      })) / limit);
      if (totalpages == 0) {
        return res.json({ totalpages: 0, msg: "no pages to show" });
      }
      if (page > totalpages || page < 1) {
        return res.json({ msg: `page value out of range, total pages are ${totalpages}` });
      }
    }
    
    const startIndex = (page - 1) * limit;
    // Fetch data from the student table based on filters
    const students = await db.students.findAll({
      where: myQuery,
      offset: startIndex,
      limit: limit,
      include: [
        {
          model: db.profiles,
          where: filtersProfile,

        },
      
      ]
    });
    // Return the result
    nextPage = page >= totalpages ? totalpages : page + 1
    students.unshift({
      next: {
        page: nextPage,
        limit: limit,
        totalpages: totalpages
      }
    });
    prevPage = page > 1 ? page - 1 : 1
    students.unshift({
      previous: {
        page: prevPage,
        limit: limit,
        totalpages: totalpages
      }
    })
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
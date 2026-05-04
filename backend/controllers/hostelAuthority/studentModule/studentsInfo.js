const db = require('../../../models/index');
const {Op} = require('sequelize');

const buildRemarkTrackingSummary = (student, currentRole) => {
  const remarks = Array.isArray(student.studentRemarks) ? student.studentRemarks : [];
  const unseenKey = currentRole === 'SuperAdmin' ? 'seenBySuperAdminAt' : 'seenByHostelAuthorityAt';
  const unseenRemarksCount = remarks.filter((remark) => !remark[unseenKey]).length;
  const latestRemark = remarks
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];

  return {
    unseenRemarksCount,
    latestRemarkAt: latestRemark?.createdAt || null,
    latestRemarkBy: latestRemark?.createdByName || latestRemark?.createdByEmail || null,
  };
};

exports.studentsInfo = async (req, res) => {
  try {
    // console.log("studentsInfo API called with query params:", req.query);
    // console.log("Admin token info:", { email: req.body.tokenEmail, hostelNo: req.body.tokenHostelNo });
    // console.log("checking the request body:", req.body);

    const userRole = req.user?.role;

    let page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let totalpages = parseInt(req.query.total) || 0;
    // let currHostelOnly = req.query.currHostel == 'true';
    // Define filters based on query parameters

    // console.log("REquest Query=", req.query);
    const filtersProfile = {};
    let myQuery = {};
 
    if (userRole === 'Hostel-Authority') {
      // Admins can *only* see their hostel's students
      myQuery.hostelNo = req.user.hostelNo;
    } else if (userRole === 'SuperAdmin') {
      // Super admin can filter by hostel using query param
      if (req.query.hostel) {
        myQuery.hostelNo = parseInt(req.query.hostel); // Convert to number
      }
    }

    if (req.query.rollNo) {

      myQuery.rollNo={ [Op.startsWith]: `${req.query.rollNo}` };

    }
    if (req.query.firstName) {

      myQuery.firstName={ [Op.startsWith]: `${req.query.firstName}` };
    }
    if (req.query.lastName) {

      myQuery.lastName={ [Op.startsWith]: `${req.query.lastName}` };
    }
    if (req.query.courseId) {

      myQuery.courseId={ [Op.startsWith]: `${req.query.courseId}` };
    }
    if (req.query.year) {
      console.log(req.query.year);
      myQuery.year=req.query.year;
    }
    if (req.query.state) {
      filtersProfile.state = req.query.state;
    }
    if (totalpages == 0) {
      const count = await db.students.count({
        where: myQuery,
        include: [
          {
            model: db.profiles,
            where: filtersProfile
          },
          {
            model: db.courses
          },
          {
            model: db.hostels
          }
        ]
      });

      // console.log("Student count:", count);

      totalpages = Math.ceil(count / limit);

      if (totalpages == 0) {
        return res.status(200).json([
          { previous: { page: 1, limit: limit, totalpages: 0 } },
          { next: { page: 1, limit: limit, totalpages: 0 } }
        ]);
      }

      if (page > totalpages || page < 1) {
        page = 1; // Reset to first page if out of range
      }
    }

    const startIndex = (page - 1) * limit;
    console.log("Query parameters:", {
      where: myQuery,
      offset: startIndex,
      limit: limit,
      include: [
        { model: db.profiles, where: filtersProfile },
        { model: db.courses, attributes: ['courseName', 'department', 'specialization'] },
        { model: db.hostels, attributes: ['hostelName', 'type'] }
      ]
    });

    // Fetch data from the student table based on filters
    const students = await db.students.findAll({
      where: myQuery,
      offset: startIndex,
      limit: limit,
      order: [
        [
          db.sequelize.literal(`
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM studentRemarks AS sr
                WHERE sr.rollNo = students.rollNo
              ) THEN 0
              ELSE 1
            END
          `),
          'ASC'
        ],
        [
          db.sequelize.literal(`
            (
              SELECT MAX(sr.createdAt)
              FROM studentRemarks AS sr
              WHERE sr.rollNo = students.rollNo
            )
          `),
          'DESC'
        ],
        ['rollNo', 'ASC']
      ],
      include: [
        {
          model: db.profiles,
          where: filtersProfile,
        },
        {
          model: db.courses,
          attributes: ['courseName', 'department', 'specialization']
        },
        {
          model: db.hostels,
          attributes: ['hostelName', 'type']
        },
        {
          model: db.studentRemarks,
          attributes: [
            'remarkId',
            'createdAt',
            'createdByName',
            'createdByEmail',
            'seenByHostelAuthorityAt',
            'seenBySuperAdminAt'
          ],
          required: false,
        }
      ]
    });

    const studentsWithRemarkSummary = students.map((student) => {
      const plainStudent = student.get({ plain: true });
      return {
        ...plainStudent,
        ...buildRemarkTrackingSummary(plainStudent, userRole),
      };
    });

    // console.log("STUDENTS DATA_>",students)

    // console.log(`Found ${students.length} students`);
    // Return the result
    let nextPage = page >= totalpages ? totalpages : page + 1;
    studentsWithRemarkSummary.unshift({
      next: {
        page: nextPage,
        limit: limit,
        totalpages: totalpages
      }
    });
    let prevPage = page > 1 ? page - 1 : 1;
    studentsWithRemarkSummary.unshift({
      previous: {
        page: prevPage,
        limit: limit,
        totalpages: totalpages
      }
    })
    return res.status(200).json(studentsWithRemarkSummary);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


const db = require('../../models');

const fetchRemarksByRollNo = async ({ rollNo }) => {
  return await db.studentRemarks.findAll({
    where: { rollNo },
    order: [['createdAt', 'DESC']],
  });
};

module.exports = { fetchRemarksByRollNo };


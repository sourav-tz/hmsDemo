const { complaints, sequelize } = require('../../models');
const { Op } = require('sequelize');

const getHostelWithMostComplaints = async () => {

  return await complaints.findAll({
    attributes: [
      'hostelNo',
      [sequelize.fn('COUNT', sequelize.col('complaintId')), 'count']
    ],
    group: ['hostelNo'],
    order: [[sequelize.literal('count'), 'DESC']],
    limit: 1
  });

};

const getTopComplaintCategories = async () => {

  return await complaints.findAll({
    attributes: [
      'tag',
      [sequelize.fn('COUNT', sequelize.col('complaintId')), 'count']
    ],
    group: ['tag'],
    order: [[sequelize.literal('count'), 'DESC']],
    limit: 5
  });

};

const getOldComplaints = async (days) => {

  const date = new Date();
  date.setDate(date.getDate() - days);

  return await complaints.findAll({
    where: {
      createdAt: {
        [Op.lt]: date
      },
      status: 'pending'
    }
  });

};

module.exports = {
  getHostelWithMostComplaints,
  getTopComplaintCategories,
  getOldComplaints
};

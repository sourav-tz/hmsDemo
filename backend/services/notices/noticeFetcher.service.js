const { Op } = require('sequelize');
const db = require('../../models');

const fetchNotices = async ({ hostelNo } = {}) => {
  const where = hostelNo
    ? { [Op.or]: [{ hostelNo }, { isGlobal: true }] }
    : { isGlobal: true };

  return db.notices.findAll({
    where,
    attributes: ['title', 'url', 'public_id', 'createdAt', 'isGlobal'],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });
};

module.exports = { fetchNotices };

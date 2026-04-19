// const db = require('../../models');
// const { Op } = require('sequelize');



// const fetchComplaintsForAdmin = async ({ hostelNo, filters = {} }) => {
//   const whereClause = {
//     hostelNo
//   };

//   // Optional status filter
//   if (filters.status) {
//     whereClause.status = filters.status;
//   }

//   // Fetch complaints
//   const complaints = await db.complaints.findAll({
//     where: whereClause,
//     order: [['createdAt', 'DESC']]
//   });

//   return complaints;
// };

// module.exports = { fetchComplaintsForAdmin };

const db = require('../../models');
const { Op } = require('sequelize');

/**
 * Fetch complaints for admin (RBAC-safe)
 * -------------------------------------
 * - DB access only
 * - Applies basic filters that exist in schema
 * - No decision logic
 * - No NLP logic
 */
const fetchComplaintsForAdmin = async ({ hostelNo, filters = {} }) => {
  const whereClause = {
    hostelNo
  };

  // 🔹 Status filter (pending / resolved / rejected)
  if (filters.status) {
    whereClause.status = filters.status;
  }

  // 🔹 Tag filter (Electricity, Water, etc.)
  if (filters.tag) {
    whereClause.tag = filters.tag;
  }

  // 🔹 Roll number filter
  if (filters.rollNo) {
    whereClause.rollNo = filters.rollNo;
  }

  // 🔹 Complaint ID filter (used for WHY intent)
  if (filters.complaintId) {
    whereClause.complaintId = filters.complaintId;
  }

  const complaints = await db.complaints.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
  });

  // Fetch room numbers via roomsStudentMappings
  const rollNos = [...new Set(complaints.map(c => c.rollNo))];
  const roomMappings = await db.roomsStudentMappings.findAll({
    where: { rollNo: { [Op.in]: rollNos } },
    include: [{ model: db.rooms, attributes: ['roomNo'] }],
    attributes: ['rollNo', 'roomId'],
  });

  const rollNoToRoom = {};
  roomMappings.forEach(m => {
    if (!rollNoToRoom[m.rollNo] && m.room) {
      rollNoToRoom[m.rollNo] = m.room.roomNo;
    }
  });

  // Attach roomNo so enrichComplaintsWithPriority can read complaint.student.room.roomNo
  // We inject it directly so the existing enricher pattern still works
  complaints.forEach(c => {
    c.dataValues.student = { room: { roomNo: rollNoToRoom[c.rollNo] ?? null } };
  });

  return complaints;
};

module.exports = { fetchComplaintsForAdmin };

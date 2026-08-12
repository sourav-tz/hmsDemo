const { complaints } = require('../../models');

const createComplaint = async ({ hostelNo, roomNo, tag, description }) => {

  const complaint = await complaints.create({
    hostelNo,
    roomNo,
    tag,
    description,
    status: "pending"
  });

  return complaint;
};

module.exports = { createComplaint };

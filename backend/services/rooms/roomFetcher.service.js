const { rooms, students } = require('../../models');

const fetchStudentsByRoom = async ({ hostelNo, roomNo }) => {

  const room = await rooms.findOne({

    where: {
      hostelNo,
      roomNo
    },

    include: [{
      model: students,
      attributes: ['rollNo','firstName','lastName']
    }]

  });

  return room?.students || [];
};

const fetchRoomDetails = async ({ hostelNo, roomNo }) => {

  return await rooms.findOne({
    where: {
      hostelNo,
      roomNo
    }
  });

};

module.exports = {
  fetchStudentsByRoom,
  fetchRoomDetails
};

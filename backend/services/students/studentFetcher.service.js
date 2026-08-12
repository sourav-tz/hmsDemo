const { students, profiles, rooms, courses } = require('../../models');
const { Op } = require('sequelize');

const fetchStudentByRollNo = async ({ hostelNo, rollNo }) => {

  const student = await students.findOne({
    where: {
      rollNo,
      hostelNo
    },

    attributes: [
      'rollNo',
      'firstName',
      'lastName',
      'year',
      'email'
    ],

    include: [
      {
        model: profiles,
        attributes: ['phoneNumber']
      },
      {
        model: rooms,
        attributes: ['roomNo']
      },
      
      {
        model: courses,
        attributes: ['courseName']
      }
    ]
  });

  return student;
};

const fetchStudentsByName = async ({ hostelNo, name }) => {
  const terms = name.trim().split(/\s+/);
  const where = { hostelNo };

  if (terms.length === 1) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${terms[0]}%` } },
      { lastName:  { [Op.like]: `%${terms[0]}%` } },
    ];
  } else {
    where.firstName = { [Op.like]: `%${terms[0]}%` };
    where.lastName  = { [Op.like]: `%${terms[terms.length - 1]}%` };
  }

  return students.findAll({
    where,
    attributes: ['rollNo', 'firstName', 'lastName', 'year', 'email'],
    include: [
      { model: profiles, attributes: ['phoneNumber'] },
      { model: rooms,    attributes: ['roomNo'] },
      { model: courses,  attributes: ['courseName'] },
    ],
    limit: 5,
  });
};

module.exports = {
  fetchStudentByRollNo,
  fetchStudentsByName,
};

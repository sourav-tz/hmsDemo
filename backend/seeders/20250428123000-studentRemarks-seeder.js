'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('studentRemarks', [
      {
        rollNo: 1,
        remarks: 'Excellent performance throughout the semester.',
        fileAttachment: null,
        createdAt: new Date(),
      },
      {
        rollNo: 2,
        remarks: 'Needs improvement in attendance and participation.',
        fileAttachment: 'attachments/roll2_remark.pdf',
        createdAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('studentRemarks', null, {});
  }
};

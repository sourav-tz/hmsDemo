'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roomsStudentMappings', [
      {
        roomId: 3,
        rollNo: 1,
        hostelNo: 1,
        comment: 'Checked in on 2025-04-28',
        last_updated_at: new Date(),
        createdAt: new Date(),

      },
      {
        roomId: 4,
        rollNo: 2,
        hostelNo: 2,
        comment: 'Checked in on 2025-04-28',
        last_updated_at: new Date(),
        createdAt: new Date(),

      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roomsStudentMappings', null, {});
  }
};

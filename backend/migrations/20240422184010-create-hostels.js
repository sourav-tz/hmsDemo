'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hostels', {
      hostelNo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      hostelName: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      last_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hostels');
  }
};

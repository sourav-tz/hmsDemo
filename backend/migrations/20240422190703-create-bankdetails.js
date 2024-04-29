'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bankdetails', {
      rollNo: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      accHolderName: {
        type: Sequelize.STRING
      },
      bankName: {
        type: Sequelize.STRING
      },
      accNumber: {
        type: Sequelize.STRING
      },
      IFSC: {
        type: Sequelize.STRING
      },
      last_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bankdetails');
  }
};

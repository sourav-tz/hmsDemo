'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rooms', {
      roomId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      roomNo: {
        type: Sequelize.INTEGER
      },
      block: {
        type: Sequelize.STRING
      },
      floorNo: {
        type: Sequelize.STRING
      },
      currentOccupancy: {
        type: Sequelize.STRING
      },
      maxOccupancy: {
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
      hostelNo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hostels',
          key: 'hostelNo'
        }
      },
      roomTypeNo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'roomtypes',
          key: 'roomTypeNo'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rooms');
  }
};

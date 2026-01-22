'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roomsStudentMappings', {
      id:{ 
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement: true,
      },
      roomId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'rooms',
          key: 'roomId'
        }
      },
      rollNo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'rollNo'
        }
      },
      hostelNo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hostels',
          key: 'hostelNo'
        }
      },
      comment: {
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
      checkOutDate: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roomsStudentMappings');
  }
};
 
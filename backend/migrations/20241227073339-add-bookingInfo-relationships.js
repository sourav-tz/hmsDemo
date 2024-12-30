'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookingInfos', {
      bookingId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      application_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'guestInfos',
          key: 'application_id', 
        },
      },
      roomID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'guestRoomInfos',
          key: 'roomID',
        },
      },
      allocatedHostel:{
        type:Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookingInfos');
  }
};

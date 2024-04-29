'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notices', {
      noticeId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull:false
      },
      url: {
        type: Sequelize.STRING,
        allowNull:false
      },
      public_id:{
        type:Sequelize.STRING,
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notices');
  }
};

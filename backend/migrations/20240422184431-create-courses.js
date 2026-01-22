'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('courses', {
      courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      courseName: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      specialization: {
        type: Sequelize.STRING
      },
      courseDuration: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('courses');
  }
};

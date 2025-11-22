'use strict';

// const { Primary } = require('@storybook/blocks');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('complaints', {
      complaintId: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      subject: {
        type: Sequelize.STRING
      },
      tag: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      description:{
        type:Sequelize.STRING,
      },
      rollNo: {
        type: Sequelize.INTEGER, // Assuming rollNo corresponds to the studentId in the students table
        references: {
          model: 'students',
          key: 'rollNo'
        }
      },
      hostelNo: {
        type: Sequelize.INTEGER, // Assuming hostelNo corresponds to the hostelId in the hostels table
        references: {
          model: 'hostels',
          key: 'hostelNo'
        }
      },
      createdAt: {
        type: Sequelize.DATE
      },
      last_updated_at: {
        type: Sequelize.DATE
      },
      comment : {
        type : Sequelize.TEXT
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('complaints');
  }
};
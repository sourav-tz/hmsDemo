'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('bankdetails', {
      fields: ['rollNo'],
      type: 'foreign key',
      name: 'fk_bankdetails_students_rollNo',
      references: {
        table: 'students',
        field: 'rollNo',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('bankdetails', 'fk_bankdetails_students_rollNo');
  }
};

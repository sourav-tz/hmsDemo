'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('profiles', {
      fields: ['rollNo'],
      type: 'foreign key',
      name: 'fk_profiles_students_rollNo',
      references: {
        table: 'students',
        field: 'rollno',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('profiles', 'fk_profiles_students_rollNo');
  }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
      await queryInterface.bulkInsert('users', [{
        email:"superadmin@nitkkr.ac.in",
        password:"asdfghjkl",
        role:"SuperAdmin",
        last_updated_by:'superadmin@nitkkr.ac.in',createdAt: new Date(),last_updated_at:new Date()
      }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('courses', [
        {courseName:"MCA",department:"MCA",courseDuration:3,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
        {courseName:"MBA",department:"MBA",courseDuration:3,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
        {courseName:"MTECH",department:"Civil",courseDuration:2,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
        {courseName:"BTECH",department:"Mechanical",courseDuration:4,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
        {courseName:"BTECH",department:"IT",courseDuration:4,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
        {courseName:"BTECH",department:"BioTech",courseDuration:4,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
        {courseName:"BTECH",department:"Cyber Security",courseDuration:4,last_updated_by:"admin@gmail.com",createdAt:new Date(),last_updated_at:new Date()},
      ], {});
    
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

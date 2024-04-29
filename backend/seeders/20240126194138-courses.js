'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('courses', [
        {courseName:"MCA",department:"MCA",courseDuration:3,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"MBA",department:"MBA",courseDuration:3,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"MTECH",department:"Civil",courseDuration:2,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"Mechanical",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"IT",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"BioTech",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"Cyber Security",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
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

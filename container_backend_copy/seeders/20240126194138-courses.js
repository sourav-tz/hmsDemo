'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('courses', [
        {courseName:"MCA",department:"MCA",specialization:"AI",courseDuration:3,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"MBA",department:"MBA",specialization:"ML",courseDuration:3,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"MTECH",department:"Civil",specialization:"NA",courseDuration:2,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"Mechanical",specialization:"ML",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"IT",specialization:"AI",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"BioTech",specialization:"BioTech",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
        {courseName:"BTECH",department:"Cyber Security",specialization:"NA",courseDuration:4,createdAt:new Date(),last_updated_at:new Date(),deletedAt:null},
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

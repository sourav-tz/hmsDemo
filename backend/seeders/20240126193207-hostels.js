'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('hostels', [
        {hostelNo:1,hostelName:'ABC',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:2,hostelName:'DEF',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:3,hostelName:'GHI',type:'Girl',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:4,hostelName:'JKL',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:5,hostelName:'MNO',type:'Girl',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:6,hostelName:'PQR',type:'Girl',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:7,hostelName:'STU',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:8,hostelName:'VWX',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null}
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

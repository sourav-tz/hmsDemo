'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('hostels', [
        {hostelNo:1,hostelName:'ABC',type:'Boys',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:2,hostelName:'DEF',type:'Boys',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:3,hostelName:'GHI',type:'Girl',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:4,hostelName:'JKL',type:'Boys',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:5,hostelName:'MNO',type:'Girl',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:6,hostelName:'PQR',type:'Girl',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:7,hostelName:'STU',type:'Boys',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()},
        {hostelNo:8,hostelName:'VWX',type:'Boys',last_updated_by:'admin@email.com',createdAt: new Date(),last_updated_at:new Date()}
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

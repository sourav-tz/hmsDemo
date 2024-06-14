'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('hostels', [
        {hostelNo:1,hostelName:'Abhimanyu Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:2,hostelName:'Bhishma Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:3,hostelName:'Chakradhar Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:4,hostelName:'Dronacharya Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:5,hostelName:'Eklavya Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:6,hostelName:'Fanibhushan Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:7,hostelName:'Girivar Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:8,hostelName:'Harihar Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:9,hostelName:'Indivar Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:10,hostelName:'Jagdishwar Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:11,hostelName:'Vivekanand Bhawan',type:'Boys',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:12,hostelName:'Alaknanda Bhawan',type:'Girls',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:13,hostelName:'Cauvery Bhawan',type:'Girls',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:14,hostelName:'Bhagirati Bhawan',type:'Girls',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
        {hostelNo:15,hostelName:'Kalpana Chawala Bhawan',type:'Girls',createdAt: new Date(),last_updated_at:new Date(),deletedAt:null},
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


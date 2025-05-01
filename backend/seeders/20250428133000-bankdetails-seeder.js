'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bankdetails', [
      {
        rollNo: 1,
        accHolderName: 'John Doe',
        bankName: 'XYZ Bank',
        accNumber: '1234567890',
        IFSC: 'XYZB0001234',
        last_updated_at: new Date(),
        createdAt: new Date(),
  
      },
      {
        rollNo: 2,
        accHolderName: 'Jane Smith',
        bankName: 'ABC Bank',
        accNumber: '0987654321',
        IFSC: 'ABCB0005678',
        last_updated_at: new Date(),
        createdAt: new Date(),
     
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bankdetails', null, {});
  }
};

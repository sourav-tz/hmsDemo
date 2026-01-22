'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Ashutosh Dwivedi: Add isActive flag to users table to track active/inactive status for Super Admins
    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    //Ashutosh Dwivedi: Remove isActive column if migration is rolled back
    await queryInterface.removeColumn('users', 'isActive');
  }
};

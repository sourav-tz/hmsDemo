'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Ashutosh Dwivedi: Add soft delete support to hostelauthoritys table
    await queryInterface.addColumn('hostelauthoritys', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    //Ashutosh Dwivedi: Add isActive flag to track active/inactive status
    await queryInterface.addColumn('hostelauthoritys', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {
    //Ashutosh Dwivedi: Remove soft delete columns if migration is rolled back
    await queryInterface.removeColumn('hostelauthoritys', 'deletedAt');
    await queryInterface.removeColumn('hostelauthoritys', 'isActive');
  }
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notices', 'uploadedBy', {
      type: Sequelize.ENUM('HA', 'SA'),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('notices', 'uploadedBy');
  },
};

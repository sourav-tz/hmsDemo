'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    if (!table.mobile) {
      await queryInterface.addColumn('users', 'mobile', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const table = await queryInterface.describeTable('users');

    if (table.mobile) {
      await queryInterface.removeColumn('users', 'mobile');
    }
  }
};

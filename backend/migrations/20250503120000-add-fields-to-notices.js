'use strict';
// Bug fix by Ravi: Bug 23 - description field missing from notices; Bug 26 - priority and expiresAt missing for rich notice workflow
// Also covers Bug 3 (deletedAt for soft-delete paranoid mode) in case it was not yet applied
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('notices');

    // Bug fix by Ravi: Bug 3 - soft delete requires deletedAt column (paranoid: true on model)
    if (!tableDescription.deletedAt) {
      await queryInterface.addColumn('notices', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    // Bug fix by Ravi: Bug 23 - description field was missing from notices table
    if (!tableDescription.description) {
      await queryInterface.addColumn('notices', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // Bug fix by Ravi: Bug 26 - priority field missing for notice urgency
    if (!tableDescription.priority) {
      await queryInterface.addColumn('notices', 'priority', {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
        allowNull: false,
      });
    }

    // Bug fix by Ravi: Bug 26 - expiresAt field missing for notice expiry
    if (!tableDescription.expiresAt) {
      await queryInterface.addColumn('notices', 'expiresAt', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('notices', 'deletedAt');
    await queryInterface.removeColumn('notices', 'description');
    await queryInterface.removeColumn('notices', 'priority');
    await queryInterface.removeColumn('notices', 'expiresAt');
  }
};

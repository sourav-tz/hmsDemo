'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('studentRemarks', 'seenByHostelAuthorityAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('studentRemarks', 'seenBySuperAdminAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('studentRemarks', 'seenBySuperAdminAt');
    await queryInterface.removeColumn('studentRemarks', 'seenByHostelAuthorityAt');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('studentRemarks', 'remarks', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('studentRemarks', 'createdByEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('studentRemarks', 'createdByName', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('studentRemarks', 'createdByRole', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('studentRemarks', 'fileAttachmentPublicId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('studentRemarks', 'fileAttachmentPublicId');
    await queryInterface.removeColumn('studentRemarks', 'createdByRole');
    await queryInterface.removeColumn('studentRemarks', 'createdByName');
    await queryInterface.removeColumn('studentRemarks', 'createdByEmail');

    await queryInterface.changeColumn('studentRemarks', 'remarks', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};

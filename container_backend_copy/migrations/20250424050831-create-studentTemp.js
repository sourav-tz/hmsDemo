'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('studentTemp', {
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      last_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      status: {
        type: Sequelize.ENUM('pending', 'profile_submitted', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      hostelNo: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'hostels',
          key: 'hostelNo'
        }
      },
      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('studentTemp');
  },
};

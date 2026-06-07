'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messMenus', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      hostelNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'hostels', key: 'hostelNo' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      day: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false,
      },
      breakfast: { type: Sequelize.TEXT, allowNull: true },
      lunch:     { type: Sequelize.TEXT, allowNull: true },
      snacks:    { type: Sequelize.TEXT, allowNull: true },
      dinner:    { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('messMenus', ['hostelNo', 'day'], {
      unique: true,
      name: 'messMenus_hostelNo_day_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('messMenus');
  },
};

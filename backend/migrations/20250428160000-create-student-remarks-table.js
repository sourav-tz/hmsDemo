'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('studentRemarks', {
      remarkId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increments with each new remark
      },
      rollNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'students',  // Reference the 'students' table
          key: 'rollNo',      // Match the 'rollNo' in the 'students' table
        },
        onDelete: 'CASCADE',  // Optional: if a student is deleted, their remarks will be deleted
        onUpdate: 'CASCADE',  // Optional: if the 'rollNo' is updated, the remarks will reflect that
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: false,  // Remarks are required
      },
      fileAttachment: {
        type: Sequelize.STRING,  // Can store file path or URL of the attachment
        allowNull: true,  // This is optional
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Automatically set the creation time
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,  // Optional: this will be updated automatically if you enable it
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('studentRemarks');
  }
};

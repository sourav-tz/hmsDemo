'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('studentArchives', {
      rollNo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      year: Sequelize.INTEGER,
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      bloodGroup: Sequelize.STRING,
      identificationMark: Sequelize.STRING,
      gender: Sequelize.STRING,
      pEmail: Sequelize.STRING,
      subAddress: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      pinCode: Sequelize.INTEGER,
      contactNumber: Sequelize.STRING,
      secondaryContact: Sequelize.STRING,
      fatherName: Sequelize.STRING,
      fatherContact: Sequelize.STRING,
      fatherOccupation: Sequelize.STRING,
      motherName: Sequelize.STRING,
      motherContact: Sequelize.STRING,
      motherOccupation: Sequelize.STRING,
      dob: Sequelize.DATEONLY,
      addharNumber: Sequelize.STRING,
      photoLink: Sequelize.STRING,
      accHolderName: Sequelize.STRING,
      bankName: Sequelize.STRING,
      accNumber: Sequelize.STRING,
      IFSC: Sequelize.STRING,
      courseId: Sequelize.INTEGER,
      referrals: Sequelize.STRING,
      roomMappings: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      remarks: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      last_updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      checkOutDate: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('studentArchives');
  }
};

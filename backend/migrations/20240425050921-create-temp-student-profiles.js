'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tempStudentProfiles', {
      rollNo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      course: {
        type: Sequelize.STRING,
      },
      semester: {
        type: Sequelize.INTEGER,
      },
      branch: {
        type: Sequelize.STRING,
      },
      contactNumber_1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contactNumber_2: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      identificationMark: {
        type: Sequelize.STRING,
      },
      bloodGroup: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      fatherName: {
        type: Sequelize.STRING,
      },
      fatherContact: {
        type: Sequelize.STRING,
      },
      fatherOccupation: {
        type: Sequelize.STRING,
      },
      motherName: {
        type: Sequelize.STRING,
      },
      motherContact: {
        type: Sequelize.STRING,
      },
      motherOccupation: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      pinCode: {
        type: Sequelize.STRING,
      },
      localGuardian: {
        type: Sequelize.STRING,
      },
      localGuardianContact: {
        type: Sequelize.STRING,
      },
      localGuardianAddress: {
        type: Sequelize.STRING,
      },
      addharNumber: {
        type: Sequelize.STRING,
      },
      photoLink: {
        type: Sequelize.STRING,
      },
      aadharCardDocument: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tempStudentProfiles');
  },
};

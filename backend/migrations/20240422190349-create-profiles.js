'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
      rollNo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'students',
          key: 'rollNo'
        }
      },
      bloodGroup: {
        type: Sequelize.STRING
      },
      identificationMark: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      pEmail: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      },
      subAddress: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      pinCode: {
        type: Sequelize.INTEGER
      },
      contactNumber: {
        type: Sequelize.STRING
      },
      secondaryContact: {
        type: Sequelize.STRING
      },
      fatherName: {
        type: Sequelize.STRING
      },
      fatherContact: {
        type: Sequelize.STRING
      },
      fatherOccupation: {
        type: Sequelize.STRING
      },
      motherName: {
        type: Sequelize.STRING
      },
      motherContact: {
        type: Sequelize.STRING
      },
      motherOccupation: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATEONLY
      },
      addharNumber: {
        type: Sequelize.STRING
      },
      photoLink: {
        type: Sequelize.STRING
      },
      last_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profiles');
  }
};

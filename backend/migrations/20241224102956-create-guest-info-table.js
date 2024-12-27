'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('guestInfos', {
      application_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Automatically increments application IDs
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['pending', 'approved', 'rejected']], // Example statuses
        },
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      guest_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      referrer_email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      id_proof_no: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      hostel_no: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true, // Ensures it only contains numbers
          len: [10, 15], // Validates typical phone number length
        },
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      checkin_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      checkout_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isAfterCheckin(value) {
            if (value <= this.checkin_date) {
              throw new Error('Checkout date must be after checkin date.');
            }
          },
        },
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['male', 'female', 'other']], // Define gender options
        },
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pincode: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isNumeric: true, // Ensures it only contains numbers
          len: [6, 6], // Example validation for typical Indian pincodes
        },
      },
      number_of_guests: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1, // Minimum 1 guest
        },
      },
      additional_requests: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      purpose_of_visit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('guestInfos');
  },
};

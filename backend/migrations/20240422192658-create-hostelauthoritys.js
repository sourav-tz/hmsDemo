'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hostelauthoritys', {
      email: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING
      },
      roleType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING,
        validate: {
          is: /^[0-9]{10}$/i
        }
      },
      avatar: {
        type: Sequelize.STRING,
        defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
      },
      last_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      hostelNo: {
        type: Sequelize.INTEGER,
        references: {
          model: 'hostels',
          key: 'hostelNo'
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hostelauthoritys');
  }
};

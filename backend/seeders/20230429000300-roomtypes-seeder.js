"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "roomtypes",
      [
        {
          type: "Single",
          facilities: "Bed, Table, Chair, Fan",
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
        {
          type: "Double",
          facilities: "2 Beds, 2 Tables, 2 Chairs, Fan, Cupboard",
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
        {
          type: "Triple",
          facilities: "3 Beds, Shared Desk, Cupboard, Fan, Light",
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roomtypes", null, {});
  },
};

"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "rooms",
      [
        {
          roomNo: 101,
          block: "A",
          floorNo: "1",
          currentOccupancy: "1",
          maxOccupancy: "2",
          hostelNo: 1,        // must exist in `hostels` table
          roomTypeNo: 1,      // must exist in `roomtypes` table
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
        {
          roomNo: 102,
          block: "B",
          floorNo: "2",
          currentOccupancy: "2",
          maxOccupancy: "2",
          hostelNo: 2,        // must exist in `hostels` table
          roomTypeNo: 2,      // must exist in `roomtypes` table
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("rooms", null, {});
  },
};

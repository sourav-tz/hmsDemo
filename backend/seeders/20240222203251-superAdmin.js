'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
      await queryInterface.bulkInsert('users', [{
        email:"52212203@nitkkr.ac.in",
        // password:"hmssecurelogin-100",
        password:"$2a$10$drpkO2ZJrf2klH9AaLWa3OwCtvbehIwwRBnEfqG3bEasNYugn3Zlu",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },{
        email:"52212206@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$9JulqYDSuPv8qzb8mAEB6eBLYRjKzX/3uA4zzTi/Pzw8v0S69eJ96",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"52211211@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110021@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110035@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110019@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110020@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110024@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110026@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110028@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      },
      {
        email:"523110018@nitkkr.ac.in",
        // password:"asdfghjkl",
        password:"$2a$10$M08E9R.fmulB5.2FR5FIy.8AKKLqPj9zaOIKSHdz3LzaIavqfalDy",
        role:"SuperAdmin",
        createdAt: new Date(),
        last_updated_at:new Date(),
        deletedAt:null
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

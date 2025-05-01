module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('students', [
        {
          rollNo: 1,
          firstName: 'John',
          lastName: 'Doe',
          year: 2,
          email: 'john.doe@example.com',
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
        {
          rollNo: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          year: 3,
          email: 'jane.smith@example.com',
          createdAt: new Date(),
          last_updated_at: new Date(),
        },
        // Other student entries...
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('students', null, {});
    }
  };
  
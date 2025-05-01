'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('profiles', [
      {
        rollNo: 1,
        bloodGroup: 'O+',
        identificationMark: 'Mole on left hand',
        gender: 'Male',
        pEmail: 'student1@example.com',
        subAddress: '123 Street Name',
        city: 'City A',
        state: 'State A',
        pinCode: 123456,
        contactNumber: '1234567890',
        secondaryContact: '9876543210',
        fatherName: 'Father Name 1',
        fatherContact: '1122334455',
        fatherOccupation: 'Engineer',
        motherName: 'Mother Name 1',
        motherContact: '2233445566',
        motherOccupation: 'Teacher',
        dob: '2000-01-01',
        addharNumber: '123456789012',
        photoLink: 'http://example.com/photo1.jpg',
        createdAt: new Date(),
        last_updated_at: new Date(),
      },
      {
        rollNo: 2,
        bloodGroup: 'A+',
        identificationMark: 'Scar on right knee',
        gender: 'Female',
        pEmail: 'student2@example.com',
        subAddress: '456 Another St',
        city: 'City B',
        state: 'State B',
        pinCode: 654321,
        contactNumber: '2233445566',
        secondaryContact: '6655443322',
        fatherName: 'Father Name 2',
        fatherContact: '3344556677',
        fatherOccupation: 'Doctor',
        motherName: 'Mother Name 2',
        motherContact: '4455667788',
        motherOccupation: 'Nurse',
        dob: '2001-05-10',
        addharNumber: '234567890123',
        photoLink: 'http://example.com/photo2.jpg',
        createdAt: new Date(),
        last_updated_at: new Date(),
      
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};

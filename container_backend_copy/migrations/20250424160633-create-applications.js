module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('applications', {
      applicationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: false, // This will differentiate the type of application (e.g., hostelChange)
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending', // can be 'pendingAtAdmin', 'forwardedToSuperAdmin', 'approvedByAdmin', 'rejectedByAdmin', 'approvedBySuperAdmin', 'rejectedBySuperAdmin'
        allowNull: false,
      },
      createdBy: {
        type: Sequelize.STRING, // This will store the rollNo (for students) or admin email id
        allowNull: false,
      },
      createdByRole: {
        type: Sequelize.STRING,
        allowNull: false, // Can be 'student' or 'admin'
      },
      toAdminId: {
        type: Sequelize.STRING, // This will store the admin ID who receives the application
        allowNull: true, // Nullable, as the application might be created by admin directly
      },
      forwardedTo: {
        type: Sequelize.STRING, // Stores the SuperAdmin ID (nullable until forwarded)
        allowNull: true,
      },
      allowAdminEdit: {
        type: Sequelize.BOOLEAN, // Indicates if admin can edit the application data
        defaultValue: false, // Default is no edit allowed
        allowNull: false,
      },
      adminComment: {
        type: Sequelize.TEXT, // Comment by admin when forwarding or rejecting the application
        allowNull: true,
      },
      superAdminComment: {
        type: Sequelize.TEXT, // Final comment from superadmin upon approval/rejection
        allowNull: true,
      },
      extraData: {
        type: Sequelize.JSON, // Flexible field to store tag-specific extra data (e.g., hostel number)
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('applications');
  },
};

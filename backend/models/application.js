module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
      applicationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdByRole: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      toAdminId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      forwardedTo: {
        type: DataTypes.STRING, // Storing hostel number to which the application is forwarded
        allowNull: true,
      },
      allowAdminEdit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      adminComment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      superAdminComment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      extraData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    }, {
      tableName: 'applications',
      timestamps: true,
    });
  
    Application.associate = (models) => {
      Application.belongsTo(models.students, {
        foreignKey: 'createdBy',
        targetKey: 'rollNo',
        as: 'student',
      });
  
      Application.belongsTo(models.hostelauthoritys, {
        foreignKey: 'toAdminId',
        targetKey: 'email',
        as: 'admin',
      });
  
      // Uncomment and customize this part when SuperAdmin model is available
      // Application.belongsTo(models.SuperAdmin, {
      //   foreignKey: 'forwardedTo',
      //   targetKey: 'superAdminId',
      //   as: 'superadmin',
      // });
    };
  
    return Application;
  };
  
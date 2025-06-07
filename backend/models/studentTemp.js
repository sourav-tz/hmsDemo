module.exports = (sequelize, DataTypes) => {
    const studentTemp = sequelize.define('studentTemp', {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
          isEmail: { msg: "Invalid email address" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.ENUM('pending', 'profile_submitted', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      hostelNo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'hostels',
          key: 'hostelNo'
        }
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      updatedAt: 'last_updated_at',
      freezeTableName: true,
    });
    studentTemp.associate = (models) => {
        studentTemp.hasOne(models.tempStudentProfiles, {
            foreignKey: {
                name: 'email'
            }
        });
        studentTemp.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
            }
        });
    };


    return studentTemp;
  };

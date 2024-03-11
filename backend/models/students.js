module.exports = (sequelize, dataTypes) => {

    const students = sequelize.define('students', {
        rollNo: {
            type: dataTypes.INTEGER,
            primaryKey: true,
        },
        firstName: {
            type: dataTypes.STRING,
        },
        lastName: {
            type: dataTypes.STRING,
        },
        year: {
            type: dataTypes.INTEGER,
        },
        email: {
            type: dataTypes.STRING,
            required: true,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Email is not a valid email address"
                },
            }
        },
        lastUpdatedBy: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'last_updated_by'
        },
    }, {
        updatedAt: 'last_updated_at'
    })
    students.associate = (models) => {
        students.hasOne(models.profiles, {
            foreignKey: {   
                name: 'rollNo'
            }
        });
        students.hasMany(models.roomsStudentMapping, {
            foreignKey: {
                name: 'rollNo'
            }
        });
        students.hasOne(models.bankdetails, {
            foreignKey: {
                name: 'rollNo'
            }
        });
        students.belongsTo(models.courses, {
            foreignKey: {
                name: 'courseId'
            }
        });
        students.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
            }
        });
        students.belongsTo(models.rooms, {
            foreignKey: {
                name: 'roomId'
            }
        });
    };
    return students;
}
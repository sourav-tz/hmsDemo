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
    }, {

        updatedAt: 'last_updated_at',
        

    })
    students.associate = (models) => {
        students.hasOne(models.profiles, {
            foreignKey: {   
                name: 'rollNo'
            }
        });
        students.hasMany(models.roomsStudentMappings, {
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
        students.hasMany(models.guestInfo, {
            foreignKey: 'referrer_email',
            as: 'referrals',
        });
        students.hasMany(models.studentRemarks, {
            foreignKey: 'rollNo', // Or whatever your foreign key is
          });
    };
    return students;
}
module.exports = (sequelize, dataTypes) => {

    const students = sequelize.define('students', {
        rollNo: {
            type: dataTypes.INTEGER,
            primaryKey:true,
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
            isEmail: true,
            references: {
                model: 'users',
                key: 'email',
              },
        },
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        },
    },{
        updatedAt: 'last_updated_at'
    })
    students.associate = (models) => {
        students.hasOne(models.profiles, {
            onDelete: "cascade",
            foreignKey: {
                name: 'rollNo'
              }
          });
          students.hasOne(models.bankdetails, {
            onDelete: "cascade",
            foreignKey: {
                name: 'rollNo'
              }
          });
          students.belongsTo(models.courses, {
            foreignKey: {
                name: 'courseName'
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
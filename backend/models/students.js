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
            required: true,
            unique: true,
             validate:{
                isEmail: true,
             }
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
            onUpdate:"cascade",
            foreignKey: {
                name: 'rollNo'
              }
          });
          students.hasOne(models.bankdetails, {
            onDelete: "cascade",
            onUpdate:"cascade",
            foreignKey: {
                name: 'rollNo'
              }
          });
          students.belongsTo(models.courses, {
            onDelete: "NO ACTION",
            onUpdate:"cascade",
            foreignKey: {
                name: 'courseId'
              }
          });
          students.belongsTo(models.hostels, {
            onDelete: "SET NULL",
            onUpdate:"cascade",
            foreignKey: {
                name: 'hostelNo'
              }
          });
          students.belongsTo(models.rooms, {
            onDelete: "SET NULL",
            onUpdate:"cascade",
            foreignKey: {
                name: 'roomId'
              }
          });
      };
    return students;
}
module.exports = (sequelize, dataTypes) => {

    const courses = sequelize.define('courses', {
        courseName: {
            type: dataTypes.STRING,
            primaryKey:true,
        },
        department: {
            type: dataTypes.STRING,
        },
        specializaion: {
            type: dataTypes.STRING,
        },
        courseDuration: {
            type: dataTypes.INTEGER,
        },
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        },
    },{
        updatedAt: 'last_updated_at'
    })
    courses.associate = (models) => {
        courses.hasMany(models.students, {
            foreignKey: {
                name: 'courseName'
              }
          });
      };
    return courses;
}
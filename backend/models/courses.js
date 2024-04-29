module.exports = (sequelize, dataTypes) => {

    const courses = sequelize.define('courses', {
        courseId:{
            type:dataTypes.INTEGER,
            primaryKey:true,
            autoIncrement: true,
        },
        courseName: {
            type: dataTypes.STRING,
        },
        department: {
            type: dataTypes.STRING,
        },
        specialization: {
            type: dataTypes.STRING,
        },
        courseDuration: {
            type: dataTypes.INTEGER,
        },
    },{
        updatedAt: 'last_updated_at',
        paranoid: true,
    })
    courses.associate = (models) => {
        courses.hasMany(models.students, {
            foreignKey: {
                name: 'courseId'
              }
          });
      };
    return courses;
}
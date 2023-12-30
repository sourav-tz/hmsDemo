module.exports = (sequelize, dataTypes) => {

    const courses = sequelize.define('courses', {
        courseId:{
            type:dataTypes.INTEGER,
            primaryKey:true
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
            onDelete:"SET NULL",
            onUpdate:"cascade",
            foreignKey: {
                name: 'courseId'
              }
          });
      };
    return courses;
}
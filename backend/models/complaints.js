module.exports = (sequelize, dataTypes) => {

    const complaints = sequelize.define('complaints', {
        complaintId:{
            type:dataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        subject: {
            type: dataTypes.STRING,
        },
        description:{
            type:dataTypes.STRING,
        },
        tag: {
            type: dataTypes.STRING,
        },
        status: {
            type: dataTypes.STRING,
        },
    },{
        updatedAt: 'last_updated_at',
    })
    complaints.associate = (models) => {
        complaints.belongsTo(models.students, {
            foreignKey: {
                name: 'rollNo'
              }
          });
        complaints.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
              }
          });
      };
    return complaints;
}
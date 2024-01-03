module.exports = (sequelize, dataTypes) => {

    const hostels = sequelize.define('hostels', {
        hostelNo: {
            type: dataTypes.INTEGER,
            primaryKey:true,
        },
        hostelName: {
            type: dataTypes.STRING,
        },
        type: {
            type: dataTypes.STRING,
        },
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        }
    },{
        updatedAt: 'last_updated_at',
        paranoid:true
    })
    hostels.associate = (models) => {
        hostels.hasMany(models.students, {
            onDelete:"SET NULL",
            onUpdate:"cascade",
            foreignKey: {
                name: 'hostelNo'
              }
          });
        hostels.hasMany(models.rooms, {
            onDelete:"cascade",
            onUpdate:"cascade",
            foreignKey: {
                name: 'hostelNo'
              }
          });
        hostels.hasMany(models.hostelauthoritys, {
            onDelete:"SET NULL",
            onUpdate:"cascade",
            foreignKey: {
                name: 'hostelNo'
              }
          });
      };
    return hostels;
}
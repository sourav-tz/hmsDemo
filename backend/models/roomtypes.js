module.exports = (sequelize, dataTypes) => {

    const roomtypes = sequelize.define('roomtypes', {
        roomTypeNo: {
            type: dataTypes.INTEGER,
            primaryKey:true,
        },
        type: {
            type: dataTypes.STRING,
        },
        facilities: {
            type: dataTypes.STRING,
        },
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        },
    },{
        updatedAt: 'last_updated_at'
    })
    roomtypes.associate = (models) => {
        roomtypes.hasMany(models.rooms, {
            foreignKey: {
                name: 'roomTypeNo'
              }
          });
      };
    return roomtypes;
}
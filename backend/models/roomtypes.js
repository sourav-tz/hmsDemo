module.exports = (sequelize, dataTypes) => {

    const roomtypes = sequelize.define('roomtypes', {
        roomTypeNo: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        //*type means name of room type 
        type: {
            type: dataTypes.STRING,
        },
        facilities: {
            type: dataTypes.STRING,
        }
    }, {
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
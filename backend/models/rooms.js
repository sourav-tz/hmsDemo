module.exports = (sequelize, dataTypes) => {

    const rooms = sequelize.define('rooms', {
        roomId: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        roomNo: {
            type: dataTypes.INTEGER,
        },
        block: {
            type: dataTypes.STRING,
        },
        floorNo: {
            type: dataTypes.STRING,
        },
        currentOccupancy: {
            type: dataTypes.STRING,
        },
        maxOccupancy: {
            type: dataTypes.STRING,
        }
    }, {
        updatedAt: 'last_updated_at'
    })
    rooms.associate = (models) => {
        rooms.hasMany(models.students, {
            foreignKey: {
                name: 'roomId'
            }
        });
        rooms.hasMany(models.roomsStudentMappings, {
            foreignKey: {
                name: 'roomId'
            }
        });
        rooms.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
            }
        });
        rooms.belongsTo(models.roomtypes, {
            foreignKey: {
                name: 'roomTypeNo'
            }
        });
    };
    return rooms;
}
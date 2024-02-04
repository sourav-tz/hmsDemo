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
        },
        lastUpdatedBy: {
            type: dataTypes.STRING,

            field: 'last_updated_by'
        },
    }, {
        updatedAt: 'last_updated_at'
    })
    rooms.associate = (models) => {
        rooms.hasMany(models.students, {
            onDelete: "SET NULL",
            onUpdate: "cascade",
            foreignKey: {
                name: 'roomId'
            }
        });
        rooms.hasMany(models.roomsStudentMapping, {
            onDelete: "RESTRICT",
            onUpdate: "cascade",
            foreignKey: {
                name: 'roomId'
            }
        });
        rooms.belongsTo(models.hostels, {
            onDelete: "cascade",
            onUpdate: "cascade",
            foreignKey: {
                name: 'hostelNo'
            }
        });
        rooms.belongsTo(models.roomtypes, {
            onDelete: "cascade",
            onUpdate: "cascade",
            foreignKey: {
                name: 'roomTypeNo'
            }
        });
    };
    return rooms;
}
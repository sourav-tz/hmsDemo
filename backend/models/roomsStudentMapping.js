module.exports = (sequelize, dataTypes) => {

    const roomsStudentMapping = sequelize.define('roomsStudentMapping', {
        roomId: {
            type: dataTypes.INTEGER,
        },
        rollNo: {
            type: dataTypes.INTEGER,
        },
        hostelNo: {
            type: dataTypes.INTEGER,
        },
        comment: {
            type: dataTypes.STRING,
        },
        //?checkin date == created at date
        lastUpdatedBy: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'last_updated_by'
        },

    }, {
        updatedAt: 'last_updated_at',
        paranoid: true,
        deletedAt: 'checkOutDate'
    })
    roomsStudentMapping.associate = (models) => {
        roomsStudentMapping.belongsTo(models.rooms, {
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
            foreignKey: {
                name: 'roomId'
            }
        });
        roomsStudentMapping.belongsTo(models.students, {
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
            foreignKey: {
                name: 'rollNo'
            }
        });
    }


    return roomsStudentMapping;
}
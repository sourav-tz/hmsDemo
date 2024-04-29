module.exports = (sequelize, dataTypes) => {

    const roomsStudentMappings = sequelize.define('roomsStudentMappings', {
       id:{
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
       },
        roomId: {
            type: dataTypes.INTEGER
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

    }, {
        updatedAt: 'last_updated_at',
        paranoid: true,
        deletedAt: 'checkOutDate'
    })
    roomsStudentMappings.associate = (models) => {
        roomsStudentMappings.belongsTo(models.rooms, {
            foreignKey: {
                name: 'roomId'
            }
        });
        roomsStudentMappings.belongsTo(models.students, {
            foreignKey: {
                name: 'rollNo'
            }
        });
    }


    return roomsStudentMappings;
}
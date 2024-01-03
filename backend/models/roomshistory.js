module.exports = (sequelize, dataTypes) => {

    const roomshistory = sequelize.define('roomshistory', {
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
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        },
    },{
        updatedAt: 'last_updated_at'
    })
    return roomshistory;
}
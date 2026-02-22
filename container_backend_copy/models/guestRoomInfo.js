module.exports = (sequelize, DataTypes) => {
    const guestRoomInfo = sequelize.define('guestRoomInfo', {
        roomId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        roomNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        block: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floorNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currentOccupancy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        maxOccupancy: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isIn: [['booked', 'available']] },
        },
        hostelNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    },
    {
        timestamps: true,
    });

    guestRoomInfo.associate = (models) => {
        guestRoomInfo.hasMany(models.bookingInfo, {
            foreignKey: 'roomId',
            as: 'bookings',
        });
    };

    return guestRoomInfo;
};

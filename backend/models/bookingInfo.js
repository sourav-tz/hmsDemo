module.exports = (sequelize, DataTypes) => {
    const bookingInfo = sequelize.define(
        'bookingInfo',
        {
            bookingId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            applicationID: {
                // Foreign Key from guestInfo
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'guestInfos', // Table name for guestInfo
                    key: 'applicationID', // Primary key in guestInfo
                },
            },
            roomID: {
                // Foreign Key from guestRoomInfo
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'guestRoomInfo', // Table name for guestRoomInfo
                    key: 'roomID', // Primary key in guestRoomInfo
                },
            },
        },
        {
            updatedAt: 'last_updated_at', // Renaming the updatedAt column
            timestamps: true, // Ensure timestamps are enabled for this option
        }
    );

    return bookingInfo;
};

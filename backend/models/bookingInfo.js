module.exports = (sequelize, DataTypes) => {
    const bookingInfo = sequelize.define('bookingInfo', {
        bookingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        roomId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        allocatedHostel:{
            type: DataTypes.INTEGER,
            allowNull:false,
        }
    }, {
        timestamps: true,
    });

    bookingInfo.associate = (models) => {
        bookingInfo.belongsTo(models.guestInfo, {
            foreignKey: 'application_id',
            as: 'guestApplication',
        });
        bookingInfo.belongsTo(models.guestRoomInfo, {
            foreignKey: 'roomId',
            as: 'room',
        });
    };

    return bookingInfo;
};

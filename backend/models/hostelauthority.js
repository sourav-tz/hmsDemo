module.exports = (sequelize, dataTypes) => {

    const hostelauthoritys = sequelize.define('hostelauthoritys', {
        email: {
            type: dataTypes.STRING,
            isEmail: true,
            primaryKey: true,

        },
        name: {
            type: dataTypes.STRING,
        },
        roleType: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: dataTypes.STRING,
            validate: {
                is: /^[0-9]{10}$/i, // Validates a 10-digit mobile number
            },
        },

        avatar: {
            type: dataTypes.STRING,
            default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        },

        lastUpdatedBy: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'last_updated_by',
            defaultValue: "adityaDon"
        },
    }, {
        updatedAt: 'last_updated_at'
    })
    hostelauthoritys.associate = (models) => {
        hostelauthoritys.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
            }
        });
        hostelauthoritys.hasOne(models.users, {
            foreignKey: {
                name: 'email'
            }
        });
    };
    return hostelauthoritys;
}
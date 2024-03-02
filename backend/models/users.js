module.exports = (sequelize, dataTypes) => {

    const users = sequelize.define('users', {
        email: {
            type: dataTypes.STRING,
            primaryKey: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        lastUpdatedBy: {
            type: dataTypes.STRING,
            allowNull: false,
            field: 'last_updated_by',
            defaultValue: "adityaDon"
        },
    }, {
        updatedAt: 'last_updated_at',
        paranoid:true
    })
    users.associate = (models) => {
        users.hasOne(models.hostelauthoritys, {
            onDelete: "SET NULL",
            onUpdate: "cascade",
            foreignKey: {
                name: 'email'
            }
        });
    };

    return users;
} 
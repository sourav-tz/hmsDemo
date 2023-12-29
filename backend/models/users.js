module.exports = (sequelize, dataTypes) => {

    const users = sequelize.define('users', {
        email: {
            type: dataTypes.STRING,
            isEmail: true,
            primaryKey: true
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
        updatedAt: 'last_updated_at'
    })

    return users;
}
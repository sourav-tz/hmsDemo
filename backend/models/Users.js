module.exports = (sequelize, dataTypes) => {

    const Users = sequelize.define('Users', {
        email: {
            type: dataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: dataTypes.STRING,
            allowNull: false,
        }
    })

    return Users;
}
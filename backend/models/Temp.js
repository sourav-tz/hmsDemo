module.exports = (sequelize, dataTypes) => {

    const Temps = sequelize.define('Temps', {
        name: {
            type: dataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: dataTypes.STRING,
            allowNull: false,
        }
    })

    return Temps;
}
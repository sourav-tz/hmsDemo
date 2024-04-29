module.exports = (sequelize, dataTypes) => {

    const otps = sequelize.define('otps', {
        email: {
            type: dataTypes.STRING,
            allowNull:false,
            primaryKey:true,
        },
        otp: {
            type: dataTypes.STRING,
            allowNull: false
        },
        expiration_time: dataTypes.DATE,
        createdAt:{
            type: dataTypes.DATE,
            default:Date.now(),
        }
    })

    return otps;
}
// module.exports = (sequelize, dataTypes) => {

//     const users = sequelize.define('users', {
//         email: {
//             type: dataTypes.STRING,
//             primaryKey: true,
//             validate: {
//                 isEmail: true
//             }
//         },
//         password: {
//             type: dataTypes.STRING,
//             allowNull: false,
//         },
//         role: {
//             type: dataTypes.STRING,
//             allowNull: false,
//         },
//     }, {
//         updatedAt: 'last_updated_at',
//         paranoid:true
//     })
//     users.associate = (models) => {
//         users.hasOne(models.hostelauthoritys, {
//             foreignKey: {
//                 name: 'email'
//             },
//         });
//     };

//     return users;
// } 

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
        isActive: {
            type: dataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        mobile: {
            type: dataTypes.STRING(10),
            allowNull: true,
            validate: { is: /^[0-9]{10}$/i },
        },
    }, {
        updatedAt: 'last_updated_at',
        paranoid:true
    })
    users.associate = (models) => {
        users.hasOne(models.hostelauthoritys, {
            foreignKey: {
                name: 'email'
            },
        });
    };

    return users;
}
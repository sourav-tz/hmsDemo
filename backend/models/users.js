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
        mobile: {
            type: dataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^[6-9]\d{9}$/,
                    msg: "mobile must be a valid 10 digit Indian mobile number"
                }
            },
        },
        isActive: {
            type: dataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        }
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

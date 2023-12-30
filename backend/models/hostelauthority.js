module.exports = (sequelize, dataTypes) => {

    const hostelauthoritys = sequelize.define('hostelauthoritys', {
        email: {
            type: dataTypes.STRING,
            isEmail: true,
            primaryKey:true,
            references: {
                model: 'users',
                key: 'email',
              },
        },
        name: {
            type: dataTypes.STRING,
        },
        roleType:{
           type:dataTypes.STRING,
           allowNull: false,
        },
        mobile:{
            type: dataTypes.STRING,
            validate: {
              is: /^[0-9]{10}$/i, // Validates a 10-digit mobile number
            },
        },
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        },
    },{
        updatedAt: 'last_updated_at'
    })
    hostelauthoritys.associate = (models) => {
        hostelauthoritys.belongsTo(models.hostels, {
            onDelete:"SET NULL",
            onUpdate:"cascade",
            foreignKey: {
                name: 'hostelNo'
              }
          });
      };
    return hostelauthoritys;
}
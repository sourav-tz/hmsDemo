module.exports = (sequelize, dataTypes) => {

    const bankdetails = sequelize.define('bankdetails', {
        rollNo: {
            type: dataTypes.INTEGER,
            primaryKey:true,
        },
        accHolderName: {
            type: dataTypes.STRING,
        },
        bankName: {
            type: dataTypes.STRING,
        },
        accNumber: {
            type: dataTypes.STRING,
        },
        IFSC: {
            type:dataTypes.STRING,
        },
    },{
        updatedAt: 'last_updated_at'
    })
    bankdetails.associate = (models) => {
        bankdetails.belongsTo(models.students, {
            foreignKey: {
                name: 'rollNo'
              }
          });
      };
    return bankdetails;
}
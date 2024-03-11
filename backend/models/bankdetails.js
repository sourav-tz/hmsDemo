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
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
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
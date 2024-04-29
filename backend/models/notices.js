module.exports = (sequelize, dataTypes) => {

    const notices = sequelize.define('notices', {
        noticeId:{
            type:dataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title: {
            type: dataTypes.STRING,
        },
        public_id: {
            type:dataTypes.STRING,
        },
        url: {
            type: dataTypes.STRING,
        },
    },{
        updatedAt: 'last_updated_at',
    })
    notices.associate = (models) => {
        notices.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
            },
        });
      };
    return notices;
}
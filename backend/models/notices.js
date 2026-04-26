module.exports = (sequelize, dataTypes) => {

    const notices = sequelize.define('notices', {
        title: {
            type: dataTypes.STRING,
        },
        public_id: {
            type:dataTypes.STRING,  
            primaryKey: true,
        },
        url: {
            type: dataTypes.STRING,
        },
        details: {
            type: dataTypes.TEXT,
            allowNull: true,
        },
        uploadedBy: {
            type: dataTypes.ENUM('HA', 'SA'),
            allowNull: true,
        },
        isGlobal: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },{
        updatedAt: 'last_updated_at',
    });
    notices.associate = (models) => {
        notices.belongsTo(models.hostels, {
            foreignKey: {
                name: 'hostelNo'
            },
        });
      };
    return notices;
}

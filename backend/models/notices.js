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
        // Bug fix by Ravi: Bug 23 - Notice creation form had no description field; only title + file existed
        description: {
            type: dataTypes.TEXT,
            allowNull: true,
        },
        // Bug fix by Ravi: Bug 26 - Rich notice workflow missing: priority field for notice urgency
        priority: {
            type: dataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'medium',
        },
        // Bug fix by Ravi: Bug 26 - Rich notice workflow missing: expiry date for auto-expiring notices
        expiresAt: {
            type: dataTypes.DATE,
            allowNull: true,
        },
        isGlobal: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },{
        updatedAt: 'last_updated_at',
        paranoid: true, // Bug fix by Ravi: Bug 3 - Notices were permanently deleted (destroy() wiped the row); paranoid: true makes Sequelize set deletedAt instead, enabling soft delete and record recovery
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
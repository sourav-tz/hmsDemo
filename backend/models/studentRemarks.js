module.exports = (sequelize, DataTypes) => {
    const studentRemarks = sequelize.define('studentRemarks', {
        remarkId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rollNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',
                key: 'rollNo',
            },
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        fileAttachment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fileAttachmentPublicId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdByEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdByName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdByRole: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        seenByHostelAuthorityAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        seenBySuperAdminAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE
        },
    }, {
        tableName: 'studentRemarks',
    });

    studentRemarks.associate = (models) => {
        studentRemarks.belongsTo(models.students, {
            foreignKey: 'rollNo',
            targetKey: 'rollNo',
        });
    };

    return studentRemarks;
};

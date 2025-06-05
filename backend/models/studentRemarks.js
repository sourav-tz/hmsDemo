module.exports = (sequelize, DataTypes) => {
    const studentRemarks = sequelize.define('studentRemarks', {
        remarkId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,  // Automatically increments with each new remark
        },
        rollNo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'students',  // Reference the 'students' table
                key: 'rollNo',      // Match the 'rollNo' in the 'students' table
            },
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: false,  // Remarks are required
        },
        fileAttachment: {
            type: DataTypes.STRING,  // Can store file path or URL of the attachment
            allowNull: true,  // This is optional
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,  // Automatically set the creation time
        },
    }, {
        tableName: 'studentRemarks',  // Explicit table name
        updatedAt: false,  // If you don't want to track updates (no `updatedAt` field)
    });

    studentRemarks.associate = (models) => {
        studentRemarks.belongsTo(models.students, {
            foreignKey: 'rollNo',
            targetKey: 'rollNo',  // This links 'rollNo' in 'studentRemarks' to 'rollNo' in 'students'
        });
    };

    return studentRemarks;
};

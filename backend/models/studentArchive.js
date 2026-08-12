module.exports = (sequelize, DataTypes) => {
    const studentArchive = sequelize.define('studentArchive', {
        rollNo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        year: {
            type: DataTypes.INTEGER,
        },
        email: {
            type: DataTypes.STRING,
            required: true,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Email is not a valid email address",
                },
            },
        },
        bloodGroup: {
            type: DataTypes.STRING,
        },
        identificationMark: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING,
        },
        pEmail: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "pEmail is not a valid email",
                },
            },
        },
        subAddress: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
        },
        pinCode: {
            type: DataTypes.INTEGER,
        },
        contactNumber: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[0-9]{10}$/i,
                    msg: "contactNumber must be 10 digits",
                },
            },
        },
        secondaryContact: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[0-9]{10}$/i,
                    msg: "secondaryContact must be 10 digits",
                },
            },
        },
        fatherName: {
            type: DataTypes.STRING,
        },
        fatherContact: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[0-9]{10}$/i,
                    msg: "fatherContact must be 10 digits",
                },
            },
        },
        fatherOccupation: {
            type: DataTypes.STRING,
        },
        motherName: {
            type: DataTypes.STRING,
        },
        motherContact: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[0-9]{10}$/i,
                    msg: "motherContact must be 10 digits",
                },
            },
        },
        motherOccupation: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATEONLY,
        },
         addharNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^\d{16}$/,
                    msg: "addharNumber must be exactly 16 digits (Virtual Aadhaar ID)",
                },
            },
        },  // closing brace for addharNumber was missing — photoLink and all fields below it were being parsed as nested inside addharNumber, causing SyntaxError at line 149

        photoLink: {
            type: DataTypes.STRING,
        },
        accHolderName: {
            type: DataTypes.STRING,
        },
        bankName: {
            type: DataTypes.STRING,
        },
        accNumber: {
            type: DataTypes.STRING,
        },
        IFSC: {
            type: DataTypes.STRING,
        },
        courseId: {
            type: DataTypes.INTEGER,
        },
        referrals: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        roomMappings:{
            type: DataTypes.JSON,  // Define remarks as JSON
            allowNull: false,
        },
        remarks: {
            type: DataTypes.JSON,  // Define remarks as JSON
            allowNull: true,  // This column is optional
        },
    }, {
        updatedAt: 'last_updated_at',
        paranoid: true,  // For soft deletes if necessary
        deletedAt: 'checkOutDate',  // Can use for soft deletes
        createdAt: 'createdAt', 
        timestamps: true,
    });

    studentArchive.associate = (models) => {
        studentArchive.belongsTo(models.students, {
            foreignKey: 'rollNo',
            targetKey: 'rollNo',
        });
        studentArchive.belongsTo(models.bankdetails, {
            foreignKey: 'rollNo',
            targetKey: 'rollNo',
        });
        studentArchive.belongsTo(models.roomsStudentMappings, {
            foreignKey: 'rollNo',
            targetKey: 'rollNo',
        });
        studentArchive.belongsTo(models.profiles, {
            foreignKey: 'rollNo',
            targetKey: 'rollNo',
        });
        studentArchive.belongsTo(models.courses, {
            foreignKey: 'courseId',
            targetKey: 'courseId',
        });
    };

    return studentArchive;
};

module.exports = (sequelize, dataTypes) => {

    const profiles = sequelize.define('profiles', {
        rollNo: {
            type: dataTypes.INTEGER,
            primaryKey:true,
            field:'rollno'
        },
        bloodGroup: {
            type: dataTypes.STRING,
        },
        identificationMark: {
            type: dataTypes.STRING,
        },
        gender: {
            type: dataTypes.STRING,
        },
        pEmail: {
            type: dataTypes.STRING,
            validate:{
                isEmail: true,
            }
        },
        subAddress: {
            type: dataTypes.STRING,
        },
        city: {
            type: dataTypes.STRING,
        },
        state: {
            type: dataTypes.STRING,
        },
        pinCode: {
            type: dataTypes.INTEGER,
        },
        contactNumber:{
            type: dataTypes.STRING,
            validate: {
              is: /^[0-9]{10}$/i, // Validates a 10-digit mobile number
            },
        },
        secondaryContact:{
            type: dataTypes.STRING,
            validate: {
              is: /^[0-9]{10}$/i, // Validates a 10-digit mobile number
            },
        },
        fatherName: {
            type: dataTypes.STRING,
        },
        fatherContact:{
            type: dataTypes.STRING,
            validate: {
              is: /^[0-9]{10}$/i, // Validates a 10-digit mobile number
            },
        },
        fatherOccupation: {
            type: dataTypes.STRING,
        },
        motherName: {
            type: dataTypes.INTEGER,
        },
        motherContact:{
            type: dataTypes.STRING,
            validate: {
              is: /^[0-9]{10}$/i, // Validates a 10-digit mobile number
            },
        },
        motherOccupation: {
            type: dataTypes.STRING,
        },
        dob: {
            type: dataTypes.DATEONLY,
        },
        addharNumber: {
            type: dataTypes.BIGINT(12),
            validate: {
                is: /^[0-9]{12}$/i, // Validates a 10-digit mobile number
              },
        },
        photoLink: {
            type: dataTypes.STRING,
        },
        lastUpdatedBy:{
           type:dataTypes.STRING,
           allowNull: false,
           field:'last_updated_by'
        },
    },{
        updatedAt: 'last_updated_at'
    })
    profiles.associate = (models) => {
        profiles.belongsTo(models.students, {
            onDelete:"cascade",
            onUpdate:"cascade",
            foreignKey: {
                name: 'rollNo'
              }
          });
      };
    return profiles;
}
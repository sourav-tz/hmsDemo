module.exports = (sequelize, dataTypes) => {

    const profiles = sequelize.define('profiles', {
        rollNo: {
            type: dataTypes.INTEGER,
            primaryKey:true,
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
                isEmail: {
                    msg:"pEmail is not an valid email"
                },
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
                is: {
                    args:/^[0-9]{10}$/i,
                    msg:"contactNumber must be 10 digits"
                  }, // Validates a 10-digit mobile number
            },
        },
        secondaryContact:{
            type: dataTypes.STRING,
            validate: {
                is: {
                    args:/^[0-9]{10}$/i,
                    msg:"secondaryContact must be 10 digits"
                  }, // Validates a 10-digit mobile number
            },
        },
        phoneNumber:{
            type: dataTypes.STRING,
            validate: {
                is: {
                    args:/^[0-9]{10,12}$/i,
                    msg:"phoneNumber must be 10-12 digits"
                  }, // Validates a landline or other phone number
            },
        },
        fatherName: {
            type: dataTypes.STRING,
        },
        fatherContact:{
            type: dataTypes.STRING,
            validate: {
                is: {
                    args:/^[0-9]{10}$/i,
                    msg:"fatherContact must be 10 digits"
                  },
            },
        },
        fatherOccupation: {
            type: dataTypes.STRING,
        },
        motherName: {
            type: dataTypes.STRING,
        },
        motherContact:{
            type: dataTypes.STRING,
            validate: {
                is: {
                    args:/^[0-9]{10}$/i,
                    msg:"motherContact must be 10 digits"
                  },
            },
        },
        motherOccupation: {
            type: dataTypes.STRING,
        },
        dob: {
            type: dataTypes.DATEONLY,
        },
        addharNumber: {
            type: dataTypes.STRING,
            validate: {
                is: {
                    args:/^[0-9]{12}$/i,
                    msg:"addharNumber must be 12 digits"
                  },
              },
        },
        photoLink: {
            type: dataTypes.STRING,
        },
        aadharCardDocument: {
            type: dataTypes.STRING,
        }
    },{
        updatedAt: 'last_updated_at'
    })
    profiles.associate = (models) => {
        profiles.belongsTo(models.students, {
            foreignKey: {
                name: 'rollNo'
              }
          });
      };
    return profiles;
}
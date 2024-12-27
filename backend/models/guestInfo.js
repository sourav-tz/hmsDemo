module.exports = (sequelize, DataTypes) => {
    const guestInfo = sequelize.define('guestInfo', {
        application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Automatically increments application IDs
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['pending', 'approved', 'rejected']], // Example statuses
            },
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guest_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        referrer_email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            },
        },
        id_proof_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hostel_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        contact_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true, // Ensures it only contains numbers
                len: [10, 15], // Validates typical phone number length
            },
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        checkin_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        checkout_date: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isAfterCheckin(value) {
                    if (value <= this.checkin_date) {
                        throw new Error('Checkout date must be after checkin date.');
                    }
                },
            },
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['male', 'female', 'other']], // Define gender options
            },
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isNumeric: true, // Ensures it only contains numbers
                len: [6, 6], // Example validation for typical Indian pincodes
            },
        },
        number_of_guests: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1, // Minimum 1 guest
            },
        },
        additional_requests: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        purpose_of_visit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        paranoid: true,   // Enables soft deletion
    });

    return guestInfo;
};

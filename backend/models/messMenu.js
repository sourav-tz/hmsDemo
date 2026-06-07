module.exports = (sequelize, DataTypes) => {
  const messMenu = sequelize.define('messMenu', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hostelNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false,
    },
    breakfast: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lunch: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    snacks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dinner: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    indexes: [
      { unique: true, fields: ['hostelNo', 'day'] }
    ]
  });

  messMenu.associate = (models) => {
    messMenu.belongsTo(models.hostels, { foreignKey: 'hostelNo' });
  };

  return messMenu;
};

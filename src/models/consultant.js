const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Consultant = sequelize.define(
    "Consultant",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      admin_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      male: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      dob: {
        type: DataTypes.STRING(255), // Trong SQL là VARCHAR(255), không phải DATE
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "Consultants",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Consultant;
};

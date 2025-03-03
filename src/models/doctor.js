const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Doctor = sequelize.define(
    "Doctor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      dob: {
        type: DataTypes.DATE, // Trong SQL là DATETIME
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      male: {
        type: DataTypes.BOOLEAN,
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
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Trong SQL là NULL
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "Doctors", // Tên bảng khớp với SQL
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Doctor;
};

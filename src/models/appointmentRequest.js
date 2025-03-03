const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AppointmentRequest = sequelize.define(
    "AppointmentRequest",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      consultant_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Trong SQL là NULL
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Trong SQL là NULL
      },
      customer_name: {
        type: DataTypes.STRING(255),
        allowNull: true, // Trong SQL là NULL
      },
      customer_phone: {
        type: DataTypes.STRING(50),
        allowNull: true, // Trong SQL là NULL
      },
      preferred_time: {
        type: DataTypes.DATE,
        allowNull: true, // Trong SQL là NULL
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      is_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: true, // Trong SQL là NULL
      },
    },
    {
      tableName: "AppointmentRequests", // Tên bảng khớp với SQL
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false, // Không có updated_at trong SQL
    }
  );
  return AppointmentRequest;
};

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DoctorSchedule = sequelize.define(
    "DoctorSchedule",
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
      user_name: {
        type: DataTypes.STRING(255),
        allowNull: true, // Trong SQL là NULL
      },
      user_phone: {
        type: DataTypes.STRING(50),
        allowNull: true, // Trong SQL là NULL
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true, // Trong SQL là NULL
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true, // Trong SQL là NULL
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: true, // Trong SQL là NULL
        defaultValue: 1, // Giá trị mặc định trong SQL
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
    },
    {
      tableName: "DoctorSchedules", // Tên bảng khớp với SQL
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return DoctorSchedule;
};

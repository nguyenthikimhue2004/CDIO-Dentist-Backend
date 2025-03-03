const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_admin: {
        type: DataTypes.BOOLEAN, // TINYINT(1) ánh xạ thành BOOLEAN trong Sequelize
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "Admin", // Tên bảng khớp với SQL
      timestamps: false, // Không có createdAt/updatedAt trong SQL
    }
  );
  return Admin;
};

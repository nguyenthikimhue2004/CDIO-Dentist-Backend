const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("CDIO", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

// Nhập các model
const Admin = require("./admin")(sequelize);
const Consultant = require("./consultant")(sequelize);
const Doctor = require("./doctor")(sequelize);
const DoctorSchedule = require("./doctorSchedule")(sequelize);
const AppointmentRequest = require("./appointmentRequest")(sequelize);

// Thiết lập mối quan hệ
Admin.hasMany(Consultant, { foreignKey: "admin_user_id" });
Consultant.belongsTo(Admin, { foreignKey: "admin_user_id" });

Admin.hasMany(Doctor, { foreignKey: "admin_id" });
Doctor.belongsTo(Admin, { foreignKey: "admin_id" });

Consultant.hasMany(DoctorSchedule, { foreignKey: "consultant_id" });
DoctorSchedule.belongsTo(Consultant, { foreignKey: "consultant_id" });

Doctor.hasMany(DoctorSchedule, { foreignKey: "doctor_id" });
DoctorSchedule.belongsTo(Doctor, { foreignKey: "doctor_id" });

Consultant.hasMany(AppointmentRequest, { foreignKey: "consultant_id" });
AppointmentRequest.belongsTo(Consultant, { foreignKey: "consultant_id" });

Doctor.hasMany(AppointmentRequest, { foreignKey: "doctor_id" });
AppointmentRequest.belongsTo(Doctor, { foreignKey: "doctor_id" });

// Xuất sequelize và các model
module.exports = {
  sequelize,
  Admin,
  Consultant,
  Doctor,
  DoctorSchedule,
  AppointmentRequest,
};

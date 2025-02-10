const { pool } = require("../config/db.config");

exports.createAppointment = async (appointmentData) => {
  const { customer_name, customer_phone, doctor_id, appointment_time } =
    appointmentData;
  if (!customer_name || !customer_phone || !doctor_id || !appointment_time) {
    throw new Error("All fields are required");
  }
  try {
    await pool.execute(
      "INSERT INTO Appointments (consultant_id, customer_name, customer_phone, doctor_id, appointment_time) VALUES (?, ?, ?, ?, ?)",
      [null, customer_name, customer_phone, doctor_id, appointment_time]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to create appointment request");
  }
};

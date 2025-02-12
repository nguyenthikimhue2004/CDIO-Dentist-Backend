const { pool } = require("../config/db.config");
const moment = require("moment");

exports.createAppointment = async (appointmentData) => {
  const { customer_name, customer_phone, doctor_id, appointment_time } =
    appointmentData;

  // Validate input data
  if (!customer_name || !customer_phone || !doctor_id || !appointment_time) {
    throw new Error("All fields are required");
  }
  try {
    // Convert appointment_time to MySQL format
    const formattedTime = moment(appointment_time, "HH:mm, DD/MM/YYYY").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    // Insert the appointment into the database
    await pool.execute(
      "INSERT INTO Appointments (consultant_id, customer_name, customer_phone, doctor_id, appointment_time) VALUES (?, ?, ?, ?, ?)",
      [null, customer_name, customer_phone, doctor_id, formattedTime]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to create appointment request");
  }
};

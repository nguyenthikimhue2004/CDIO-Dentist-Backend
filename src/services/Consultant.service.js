const { pool } = require("../config/db.config");
const bcrypt = require("bcrypt");
const moment = require("moment/moment");
const { NotFoundError, BadRequestError } = require("../utils/exception");
// check if consultant email exists
exports.checkConsultantEmailExists = async (email) => {
  try {
    const [consultant] = await pool.execute(
      "SELECT * FROM Consultants WHERE email = ?",
      [email]
    );
    return consultant.length > 0; // Trả về true nếu email đã tồn tại
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to check consultant email existence");
  }
};
// add Consultant
exports.addConsultant = async (adminUserId, consultantData) => {
  let { name, email, phone, location, dob, male, password, profile_image } =
    consultantData;
  // convert email to lowercase
  email = email.toLowerCase();
  if (
    !name ||
    !email ||
    !phone ||
    !location ||
    !dob ||
    male === undefined ||
    !password
  ) {
    throw new Error("Missing required fields");
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.execute(
      "INSERT INTO Consultants (admin_user_id, name, email, phone, location, dob, male, password, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        adminUserId,
        name,
        email,
        phone,
        location,
        dob,
        male,
        hashedPassword,
        profile_image,
      ]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
};
// get email
exports.getConsultantByEmail = async (email, id) => {
  try {
    const [consultant] = await pool.execute(
      "SELECT * FROM Consultants WHERE email = ? AND id = ?",
      [email, id]
    );
    return consultant[0];
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new error("Failed to get consultant by email");
  }
};

// get consultant by id
exports.getConsultantById = async (id) => {
  try {
    const [consultant] = await pool.execute(
      "SELECT * FROM Consultants WHERE id = ?",
      [id]
    );

    if (consultant.length === 0) {
      throw new NotFoundError("Consultant not found");
    }

    // Add full image URL for frontend
    const consultantData = consultant[0];
    if (consultantData.profile_image) {
      consultantData.profile_image = `/public/img/consultants/${consultantData.profile_image}`;
    }

    return consultantData;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get consultant by id");
  }
};
// get all Consultants
exports.getAllConsultants = async () => {
  try {
    const [consultants] = await pool.execute("SELECT * FROM Consultants");

    // Add full image URL for each consultant
    consultants.forEach((consultant) => {
      if (consultant.profile_image) {
        consultant.profile_image = `/public/img/consultants/${consultant.profile_image}`;
      }
    });

    return consultants;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get all consultants");
  }
};
// update information of Consultant
exports.updateConsultant = async (id, consultantData) => {
  try {
    const { name, email, phone, location, dob, male, password, profile_image } =
      consultantData;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email.toLowerCase();
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (dob !== undefined) updateFields.dob = dob;
    if (male !== undefined) updateFields.male = male;
    if (password !== undefined) {
      const saltRounds = 10;
      updateFields.password = await bcrypt.hash(password, saltRounds);
    }
    if (profile_image !== undefined) updateFields.profile_image = profile_image;
    // check if case is empty
    if (Object.keys(updateFields).length === 0) {
      throw new Error("No fields to update");
    }
    // update consultant
    const fieldsToUpdate = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updateFields), id];

    await pool.execute(
      `UPDATE Consultants SET ${fieldsToUpdate} WHERE id = ?`,
      values
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to update consultant");
  }
};
// delete Consultant
exports.deleteConsultant = async (id) => {
  try {
    // Kiểm tra xem consultant có tồn tại không
    const [consultant] = await pool.execute(
      "SELECT * FROM Consultants WHERE id = ?",
      [id]
    );
    if (consultant.length === 0) {
      throw new NotFoundError("Consultant not found");
    }

    // Thực hiện xóa consultant
    await pool.execute("DELETE FROM Consultants WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

// getDoctorSchedules
exports.getDoctorSchedules = async (doctorId) => {
  try {
    const [schedules] = await pool.execute(
      "SELECT * FROM DoctorSchedules WHERE doctor_id = ?",
      [doctorId]
    );
    return schedules;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get doctor schedules");
  }
};

// get appointment requests
exports.getAppointmentRequests = async () => {
  try {
    const [appointmentRequests] = await pool.execute(
      "SELECT * FROM AppointmentRequests WHERE is_confirmed = false"
    );
    return appointmentRequests;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get appointment requests");
  }
};

// confirm appointment request
exports.confirmAppointmentRequest = async (appointmentRequestId) => {
  try {
    const [request] = await pool.execute(
      "SELECT * FROM AppointmentRequests WHERE id = ?",
      [appointmentRequestId]
    );

    if (request.length === 0) {
      throw new NotFoundError("Appointment request not found");
    }

    const {
      consultant_id,
      customer_name,
      customer_phone,
      doctor_id,
      preferred_time,
    } = request[0];

    // add appointment
    await pool.execute(
      "INSERT INTO Appointments (consultant_id, customer_name, customer_phone, doctor_id, appointment_time) VALUES (?, ?, ?, ?, ?)",
      [consultant_id, customer_name, customer_phone, doctor_id, preferred_time]
    );

    // update schedule of doctor
    await addAppointmentToDoctorSchedule(doctor_id, preferred_time); // delete appointment request
    await pool.execute("DELETE FROM AppointmentRequests WHERE id = ?", [
      appointmentRequestId,
    ]);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to confirm appointment request");
  }
};

//  update appointment status
exports.updateAppointmentStatus = async (id, status) => {
  try {
    await pool.execute("UPDATE Appointments SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to update appointment status");
  }
};

// add appointment to doctor schedule
exports.addAppointmentToDoctorSchedule = async (doctorId, appointmentTime) => {
  try {
    const formattedTime = moment(appointmentTime, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );
    const formattedEndTime = moment(formattedTime)
      .add(120, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    const [existingSchedule] = await pool.execute(
      "SELECT * FROM DoctorSchedules WHERE doctor_id = ? AND start_time <= ? AND end_time >= ?",
      [doctorId, formattedTime, formattedEndTime]
    );

    if (existingSchedule.length > 0) {
      throw new Error(
        "The appointment time conflicts with an existing schedule"
      );
    }

    await pool.execute(
      "INSERT INTO DoctorSchedules (doctor_id, start_time, end_time) VALUES (?, ?, ?)",
      [doctorId, formattedTime, formattedEndTime]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to add appointment to doctor schedule");
  }
};

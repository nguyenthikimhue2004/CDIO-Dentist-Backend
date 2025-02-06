const { pool } = require("../config/db.config");

// add doctor
exports.addDoctor = async (adminID, dortorData) => {
  const { name, email, phone, location, dob, experience, male } = dortorData;

  if (
    !name ||
    !email ||
    !phone ||
    !location ||
    !dob ||
    !experience ||
    male === undefined
  ) {
    throw new Error("Missing required fields");
  }

  try {
    await pool.execute(
      "INSERT INTO Doctors(admin_id, name, email, phone, location, dob, experience, male) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [adminID, name, email, phone, location, dob, experience, male]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
};

// get doctor by id
exports.getDoctorById = async (id) => {
  const [doctor] = await pool.execute("SELECT * FROM Doctors WHERE id = ?", [
    id,
  ]);
  return doctor;
};

// get all doctors
exports.getAllDoctors = async (adminID) => {
  const [doctors] = await pool.execute(
    "SELECT * FROM Doctors WHERE admin_id = ?",
    [adminID]
  );
  return doctors;
};

// update information of doctor
exports.updateDoctor = async (doctorID, doctorData) => {
  const { name, email, phone, location, dob, experience, male } = doctorData;
  await pool.execute(
    "UPDATE Doctors SET name = ?, email = ?, phone = ?, location = ?, dob = ?, experience = ?, male = ? = ? WHERE id = ?",
    [name, email, phone, location, dob, experience, male, doctorID]
  );
};

// delete doctor
exports.deleteDoctor = async (doctorID) => {
  await pool.execute("DELETE FROM Doctors WHERE id = ?", [doctorID]);
};

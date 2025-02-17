const { pool } = require("../config/db.config");

// check if doctor exists
exports.checkDoctorExists = async (doctorID) => {
  const [doctor] = await pool.execute("SELECT * FROM Doctors WHERE id = ?", [
    doctorID,
  ]);
  return doctor.length > 0;
};

// add doctor
exports.addDoctor = async (adminID, dortorData) => {
  let { name, email, phone, location, dob, experience, male } = dortorData;
  // convert email to lowercase
  email = email.toLowerCase();
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
      "INSERT INTO Doctors(admin_id, name, email, phone, location, dob, experience, male) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [adminID, name, email, phone, location, dob, experience, male]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
};

// get id by name doctor
exports.getDoctorIdByName = async (name) => {
  try {
    const [doctor] = await pool.execute(
      "SELECT id FROM Doctors WHERE name = ?",
      [name]
    );
    return doctor[0].id;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get id by name");
  }
};

// get doctor by id
exports.getDoctorById = async (id) => {
  try {
    const [doctor] = await pool.execute("SELECT * FROM Doctors WHERE id = ?", [
      id,
    ]);
    return doctor;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get doctor by id");
  }
};

// get all doctors
exports.getAllDoctors = async () => {
  try {
    const [doctors] = await pool.execute("SELECT * FROM Doctors");
    return doctors;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get all doctors");
  }
};
// update information of doctor
exports.updateDoctor = async (doctorID, doctorData) => {
  try {
    const { name, email, phone, location, dob, experience, male } = doctorData;

    // create a object to store the data
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email.toLowerCase();
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (dob !== undefined) updateFields.dob = dob;
    if (experience !== undefined) updateFields.experience = experience;
    if (male !== undefined) updateFields.male = male;

    // check if case is empty
    if (Object.keys(updateFields).length === 0) {
      throw new Error("No fields to update");
    }

    // update the data
    const fieldsToUpdate = Object.keys(updateFields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = [...Object.values(updateFields), doctorID];

    await pool.execute(
      `UPDATE Doctors SET ${fieldsToUpdate} WHERE id = ?`,
      values
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to update doctor");
  }
};

// delete doctor
exports.deleteDoctor = async (doctorID) => {
  try {
    await pool.execute("DELETE FROM Doctors WHERE id = ?", [doctorID]);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to delete doctor");
  }
};

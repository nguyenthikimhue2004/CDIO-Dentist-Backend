const { pool } = require("../config/db.config");
const bcrypt = require("bcrypt");

// add Consultant
exports.addConsultant = async (adminUserId, consultantData) => {
  let { name, email, phone, location, dob, male, password } = consultantData;
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
      "INSERT INTO Consultants (admin_user_id, name, email, phone, location, dob, male, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [adminUserId, name, email, phone, location, dob, male, hashedPassword]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
};
// get email
exports.getConsultantByEmail = async (email) => {
  try {
    const [consultant] = await pool.execute(
      "SELECT * FROM Consultants WHERE email = ?",
      [email]
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
    return consultant;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get consultant by id");
  }
};
// get all Consultants
exports.getAllConsultants = async () => {
  try {
    const [consultants] = await pool.execute("SELECT * FROM Consultants");
    return consultants;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get all consultants");
  }
};
// update information of Consultant
exports.updateConsultant = async (id, consultantData) => {
  try {
    const { name, email, phone, location, dob, male, password } =
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
  await pool.execute("DELETE FROM Consultants WHERE id = ?", [id]);
};

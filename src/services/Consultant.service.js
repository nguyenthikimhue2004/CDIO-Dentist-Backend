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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await pool.execute(
      "UPDATE Consultants SET name = ?, email = ?, phone = ?, location = ?, dob = ?, male = ?, password = ? WHERE id = ?",
      [name, email, phone, location, dob, male, hashedPassword, id]
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

const { pool } = require("../config/db.config");
const bcrypt = require("bcrypt")

// add Consultant
exports.addConsultant = async (adminUserId, consultantData) => {
  const { name, email, phone, location, dob, male, password } = consultantData;

  if (!name || !email || !phone || !location || !dob || male === undefined || !password) {
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
  const [consultant] = await pool.execute(
    "SELECT * FROM Consultants WHERE email = ?",
    [email]
  );
  return consultant[0];
};
// get consultant by id
exports.getConsultantById = async (id) => {
  const [consultant] = await pool.execute(
    "SELECT * FROM Consultants WHERE id = ?",
    [id]
  );
  return consultant;
};
// get all Consultants
exports.getAllConsultants = async () => {
  const [consultants] = await pool.execute("SELECT * FROM Consultants");
  return consultants;
};
// update information of Consultant
exports.updateConsultant = async (id, consultantData) => {
  const { name, email, phone, location, dob, male } = consultantData;
  await pool.execute(
    "UPDATE Consultants SET name = ?, email = ?, phone = ?, location = ?, dob = ? = ?, male = ? WHERE id = ?",
    [name, email, phone, location, dob, male, id]
  );
};
// delete Consultant
exports.deleteConsultant = async (id) => {
  await pool.execute("DELETE FROM Consultants WHERE id = ?", [id]);
};



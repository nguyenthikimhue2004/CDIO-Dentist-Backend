const { pool } = require("../config/db.config");

// add Consultant
exports.addConsultant = async (adminUserId, consultantData) => {
  const { name, email, phone, location, dob, male } = consultantData;

  if (!name || !email || !phone || !location || !dob || male === undefined) {
    throw new Error("Missing required fields");
  }

  try {
    await pool.execute(
      "INSERT INTO Consultants (admin_user_id, name, email, phone, location, dob, male) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [adminUserId, name, email, phone, location, dob, male]
    );
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw error;
  }
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
exports.getConsultants = async (adminUserId) => {
  const [consultants] = await pool.execute(
    "SELECT * FROM Consultants WHERE admin_user_id = ?",
    [adminUserId]
  );
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

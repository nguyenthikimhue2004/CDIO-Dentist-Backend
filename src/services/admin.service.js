const { pool } = require("../config/db.config");
const bcrypt = require("bcrypt");
// check if admin exists
exports.checkEmailExists = async (email) => {
  try {
    // convert email to lowercase
    email = email.toLowerCase();
    const [admin] = await pool.execute("SELECT * FROM Admin WHERE email = ?", [
      email,
    ]);

    return admin.length > 0;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new error("Failed to check if email exists");
  }
};

// get admin by email
exports.getAdminByEmail = async (email) => {
  try {
    // convert email to lowercase
    email = email.toLowerCase();
    const [admin] = await pool.execute("SELECT * FROM Admin WHERE email = ?", [
      email,
    ]);

    return admin;
  } catch (error) {
    console.error("Error executing SQL query:", error);
    throw new Error("Failed to get admin by email");
  }
};

// register admin
exports.registerAdmin = async (email, password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.execute(
      "INSERT INTO Admin (email, password, is_admin) VALUES (?, ?, ?)",
      [email, hashedPassword, true] // is_admin = true for admin
    );
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

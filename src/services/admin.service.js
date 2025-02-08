const { pool } = require("../config/db.config");

// check if admin exists
exports.checkEmailExists = async (email) => {
  const [admin] = await pool.execute("SELECT * FROM Admin WHERE email = ?", [
    email,
  ]);

  return admin.length > 0;
};

// get admin by email
exports.getAdminByEmail = async (email) => {
  const [admin] = await pool.execute("SELECT * FROM Admin WHERE email = ?", [
    email,
  ]);

  return admin;
};

// register admin
exports.registerAdmin = async (email, password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.execute(
      "INSERT INTO Admin (email, password, is_admin) VALUES (?, ?, ?)",
      [email, hashedPassword, true] // is_admin = true vì đây là admin
    );
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

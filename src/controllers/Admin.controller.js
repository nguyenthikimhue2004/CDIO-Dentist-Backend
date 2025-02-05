const { getAdminByEmail } = require("../services/Admin.service");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const { pool } = require("../config/db.config");

// register admin
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  // check input data
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // check if email is already registered
    const [existingAdmin] = await pool.execute(
      "SELECT * FROM Admin WHERE email = ?",
      [email]
    );
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // password hashing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // save admin to database
    await pool.execute(
      "INSERT INTO Admin (email, password, is_admin) VALUES (?, ?, ?)",
      [email, hashedPassword, true] // is_admin = true vì đây là admin
    );

    // response
    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // check input data
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // check if email is registered
    const [admin] = await getAdminByEmail(email);
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const { accessToken, refreshToken } = generateToken({
      id: admin.id,
      email: admin.email,
      is_admin: true,
    });

    // response
    return res.status(200).json({
      message: "Login successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

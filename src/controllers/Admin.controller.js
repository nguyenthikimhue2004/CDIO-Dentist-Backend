const { getAdminByEmail } = require("../services/admin.service");
const { generateToken } = require("../utils/jwt");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [admin] = await getAdminByEmail(email);
    if (!admin || admin.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken({
      id: admin.id,
      email,
      is_admin: true,
    });

    // Send response
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

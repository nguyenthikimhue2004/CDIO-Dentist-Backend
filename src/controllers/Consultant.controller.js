const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { getConsultantByEmail } = require("../services/Consultant.service");

// Login Consultant
exports.loginConsultant = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check consultant exists
    const consultant = await getConsultantByEmail(email);
    if (!consultant) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // So sánh mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, consultant.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Tạo token
    const { accessToken, refreshToken } = generateToken({
      id: consultant.id,
      email: consultant.email,
      is_admin: false, // Consultant không phải là admin
    });

    // Trả về token và thông tin consultant
    res.json({
      message: "Login successfully",
      accessToken,
      refreshToken,
      consultant: {
        id: consultant.id,
        name: consultant.name,
        email: consultant.email,
      },
    });
  } catch (error) {
    console.error("Error in loginConsultant:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

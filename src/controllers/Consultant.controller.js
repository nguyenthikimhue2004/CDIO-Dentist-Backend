const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const { getConsultantByEmail } = require("../services/Consultant.service");
const {
  validateLoginConsultant,
} = require("../validator/Consultant.validator");
const { validationResult } = require("express-validator");
const { UnauthorizedError, CustomError } = require("../utils/exception");
// Login Consultant
exports.loginConsultant = [
  validateLoginConsultant,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { email, password } = req.body;

    try {
      // check consultant exists
      const consultant = await getConsultantByEmail(email);
      if (!consultant) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // compare password
      const isPasswordValid = await bcrypt.compare(
        password,
        consultant.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // generate token
      const { accessToken, refreshToken } = generateToken({
        id: consultant.id,
        email: consultant.email,
        is_admin: false, // Consultant không phải là admin
      });

      // return token
      res.json({
        message: "Login successfully",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error in loginConsultant:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

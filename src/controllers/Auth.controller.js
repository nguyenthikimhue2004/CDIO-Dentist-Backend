require("dotenv").config();
const { CustomError, BadRequestError } = require("../utils/exception");
const { verifyToken, generateToken } = require("../utils/jwt");
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Refresh Token Expired" });
  }
  try {
    // authentacation of the refresh token
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // generate new access token
    const accessToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      is_admin: decoded.is_admin,
    });

    // return new access token
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Error refresh token: ", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(401).json({ message: "Invalid Refresh Token" });
  }
};

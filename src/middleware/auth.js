const { verifyToken } = require("../utils/jwt");

const authenticateAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = verifyToken(token);
    if (!decoded.is_admin) {
      return res
        .status(403)
        .json({ message: "Forbidden! Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
// Middleware xác thực token
const authenticateConsultant = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded.is_admin) {
      return res
        .status(403)
        .json({ message: "Forbidden! Consultant access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
module.exports = { authenticateAdmin, authenticateConsultant };

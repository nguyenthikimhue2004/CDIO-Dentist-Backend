const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../../middleware/auth");
const { refreshToken } = require("../../controllers/Auth.controller");
const {
  registerAdmin,
  loginAdmin,
} = require("../../controllers/Admin.controller");

// register admin
router.post("/admin/register", registerAdmin);

// Admin authentication
router.post("/admin/login", loginAdmin);

// refresh token
router.post("/admin/refresh-token", refreshToken);

module.exports = router;

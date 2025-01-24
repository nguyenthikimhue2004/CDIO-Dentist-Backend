// routes for the app model
const express = require("express");
const { loginAdmin } = require("../../controllers/Admin.controller");
const router = express.Router();

router.post("/admin/login", loginAdmin);

module.exports = router;

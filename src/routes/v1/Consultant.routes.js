const express = require("express");
const router = express.Router();
const { loginConsultant } = require("../../controllers/Consultant.controller");

router.post("/login", loginConsultant);

module.exports = router;

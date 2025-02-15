const express = require("express");
const router = express.Router();

const {
  getDoctors,
  createAppointment,
} = require("../../controllers/User.controller");

// get list of doctors
router.get("/doctors", getDoctors);

// create appointment-request
router.post("/appointment", createAppointment);

module.exports = router;

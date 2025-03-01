const express = require("express");
const router = express.Router();

const {
  getDoctors,
  createAppointment,
  getDoctorSchedules,
} = require("../../controllers/User.controller");

// get list of doctors
router.get("/doctors", getDoctors);

// get schedule of a doctor by id
router.get("/doctor/:id", getDoctorSchedules);

// create appointment-request
router.post("/appointment", createAppointment);

module.exports = router;

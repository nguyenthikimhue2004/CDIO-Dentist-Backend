const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../../middleware/auth");
const {
  getDoctors,
  createAppointment,
  getUserAppointments,
} = require("../../controllers/User.controller");

// See the list of doctors
router.get("/doctors");

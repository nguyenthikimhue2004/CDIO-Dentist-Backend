const express = require("express");
const router = express.Router();
const {
  loginConsultant,
  getDoctorSchedules,
  getAppointmentRequests,
  confirmAppointmentRequest,
  updateAppointmentStatus,
} = require("../../controllers/Consultant.controller");
const { authenticateConsultant } = require("../../middleware/auth");

router.post("/login", loginConsultant);
router.get("/doctors/:doctorId/schedules", getDoctorSchedules);
router.get(
  "/appointment-requests",
  authenticateConsultant,
  getAppointmentRequests
);
router.put(
  "/appointment-requests/:requestId/confirm",
  authenticateConsultant,
  confirmAppointmentRequest
);
router.put(
  "/appointments/:id",
  authenticateConsultant,
  updateAppointmentStatus
);
module.exports = router;

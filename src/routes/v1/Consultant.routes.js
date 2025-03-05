const express = require("express");
const router = express.Router();
const {
  loginConsultant,
  getDoctorSchedules,
  getAppointmentRequests,
  confirmAppointmentRequest,
  logoutConsultant,
  updateScheduleDoctor,
  getConsultantById,
} = require("../../controllers/Consultant.controller");
const { authenticateConsultant } = require("../../middleware/auth");

router.post("/login", loginConsultant);
router.post("logout", logoutConsultant);
router.get("/doctor-schedule/:doctorId", getDoctorSchedules);
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
  "/update-schedule-doctor/:doctorId",
  authenticateConsultant,
  updateScheduleDoctor
);
router.get("/:id", authenticateConsultant, getConsultantById);
// router.put(
//   "/appointments/:id",
//   authenticateConsultant,
//   updateAppointmentStatus
// );
module.exports = router;

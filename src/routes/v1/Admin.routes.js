const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../../middleware/auth");
const { refreshToken } = require("../../controllers/Auth.controller");
const {
  // admin
  registerAdmin,
  loginAdmin,
  // consultant
  addConsultant,
  getConsultantById,
  getAllConsultants,
  updateConsultant,
  deleteConsultant,
  // doctor
  addDoctor,
  getDoctorById,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
} = require("../../controllers/Admin.controller");

// register admin
router.post("/register", registerAdmin);

// Admin authentication
router.post("/login", loginAdmin);

// refresh token
router.post("/refresh-token", refreshToken);

// Consultant management

// add consultant
router.post("/consultant", authenticateAdmin, addConsultant);
// get consultant by id
router.get("/consultant/:id", authenticateAdmin, getConsultantById);
// get all consultants
router.get("/consultants", authenticateAdmin, getAllConsultants);
// update consultant
router.put("/consultants/:id", authenticateAdmin, updateConsultant);
// delete consultant
router.delete("/consultants/:id", authenticateAdmin, deleteConsultant);

// Doctor management

// add doctor
router.post("/doctor", authenticateAdmin, addDoctor);
// get doctor by id
router.get("/doctor/:id", authenticateAdmin, getDoctorById);
// get all doctors
router.get("/doctors", authenticateAdmin, getAllDoctors);
// update doctor
router.put("/doctors/:id", authenticateAdmin, updateDoctor);
// delete doctor
router.delete("/doctors/:id", authenticateAdmin, deleteDoctor);

module.exports = router;

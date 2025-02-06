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
  getConsultants,
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
router.post("/admin/register", registerAdmin);

// Admin authentication
router.post("/admin/login", loginAdmin);

// refresh token
router.post("/admin/refresh-token", refreshToken);

// Consultant management

// add consultant
router.post("/admin/consultants", authenticateAdmin, addConsultant);
// get consultant by id
router.get("/admin/consultant/:id", authenticateAdmin, getConsultantById);
// get all consultants
router.get("/admin/consultants", authenticateAdmin, getConsultants);
// update consultant
router.put("/admin/consultants/:id", authenticateAdmin, updateConsultant);
// delete consultant
router.delete("/admin/consultants/:id", authenticateAdmin, deleteConsultant);

// Doctor management

// add doctor
router.post("/admin/doctors", authenticateAdmin, addDoctor);
// get doctor by id
router.get("/admin/doctor/:id", authenticateAdmin, getDoctorById);
// get all doctors
router.get("/admin/doctors", authenticateAdmin, getAllDoctors);
// update doctor
router.put("/admin/doctors/:id", authenticateAdmin, updateDoctor);
// delete doctor
router.delete("/admin/doctors/:id", authenticateAdmin, deleteDoctor);

module.exports = router;

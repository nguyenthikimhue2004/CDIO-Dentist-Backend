const {
  getAdminByEmail,
  registerAdmin,
  checkEmailExists,
} = require("../services/Admin.service");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const {
  addConsultant,
  getConsultants,
  updateConsultant,
  deleteConsultant,
  getConsultantById,
} = require("../services/Consultant.service");
const {
  addDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllDoctorsByAdminId,
} = require("../services/Doctor.service");
const { validationResult } = require("express-validator");
const {
  validateAdminLogin,
  validateAdminRegistration,
} = require("../validator/Admin.validator");
exports.registerAdmin = [
  validateAdminRegistration, // Use validation middleware
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    const { email, password } = req.body;

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered" });
      }

      await registerAdmin(email, password);
      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error in registerAdmin:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

// login admin
exports.loginAdmin = [
  validateAdminLogin, // Use validation middleware
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    const { email, password } = req.body;

    try {
      const [admin] = await getAdminByEmail(email);
      if (!admin) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const { accessToken, refreshToken } = generateToken({
        id: admin.id,
        email: admin.email,
        is_admin: true,
      });

      return res
        .status(200)
        .json({ message: "Login successfully", accessToken, refreshToken });
    } catch (error) {
      console.error("Error in loginAdmin:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

// add Consultant
exports.addConsultant = async (req, res) => {
  try {
    await addConsultant(req.user.id, req.body);
    res.status(201).json({ message: "Consultant added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get consultant by id
exports.getConsultantById = async (req, res) => {
  try {
    const consultant = await getConsultantById(req.params.id);
    res.status(200).json(consultant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all Consultants
exports.getConsultants = async (req, res) => {
  try {
    const consultants = await getConsultants(req.user.id);
    res.status(200).json(consultants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update information of Consultant
exports.updateConsultant = async (req, res) => {
  try {
    await updateConsultant(req.params.id, req.body);
    res.status(200).json({ message: "Consultant updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete Consultant
exports.deleteConsultant = async (req, res) => {
  try {
    await deleteConsultant(req.params.id);
    res.status(200).json({ message: "Consultant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// add Doctor
exports.addDoctor = async (req, res) => {
  try {
    await addDoctor(req.user.id, req.body);
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get doctor by id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    res.status(200).json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all Doctors
exports.getAllDoctorsByAdminId = async (req, res) => {
  try {
    const doctors = await getAllDoctorsByAdminId(req.user.id);
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update information of Doctor
exports.updateDoctor = async (req, res) => {
  try {
    await updateDoctor(req.params.id, req.body);
    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await deleteDoctor(req.params.id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

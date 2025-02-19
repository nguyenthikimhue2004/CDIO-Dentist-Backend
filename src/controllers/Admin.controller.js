const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  CustomError,
  UnauthorizedError,
} = require("../utils/exception");
const { validationResult } = require("express-validator");
const { validateAddConsultant } = require("../validator/Consultant.validator");
// validation
const {
  validateAdminLogin,
  validateAdminRegistration,
} = require("../validator/Admin.validator");
// import services
// admin services
const {
  getAdminByEmail,
  registerAdmin,
  checkEmailExists,
} = require("../services/Admin.service");
// consultant services
const {
  addConsultant,
  getAllConsultants,
  updateConsultant,
  deleteConsultant,
  getConsultantById,
  checkConsultantEmailExists,
} = require("../services/Consultant.service");
// doctor services
const {
  addDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  checkDoctorEmailExists,
} = require("../services/Doctor.service");

exports.registerAdmin = [
  validateAdminRegistration, // Use validation middleware
  async (req, res) => {
    const errors = validationResult(req, res);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    let { email, password } = req.body;

    // convert email to lowercase
    email = email.toLowerCase();

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        throw new BadRequestError("Email already exists");
      }

      await registerAdmin(email, password);
      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error in registerAdmin:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
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

    let { email, password } = req.body;

    // convert email to lowercase
    email = email.toLowerCase();

    try {
      const [admin] = await getAdminByEmail(email);
      if (!admin) {
        throw new NotFoundError("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
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
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

// add Consultant
exports.addConsultant = [
  validateAddConsultant,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    try {
      if (await checkConsultantEmailExists(req.body.email)) {
        throw new BadRequestError("Email is existed");
      }
      await addConsultant(req.user.id, req.body);
      res.status(201).json({ message: "Consultant added successfully" });
    } catch (error) {
      console.error("error in add consultant: ", error);
      if (error instanceof BadRequestError) {
        return res.status(400).json({ message: "Email is existed" });
      }
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

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
exports.getAllConsultants = async (req, res) => {
  try {
    const consultants = await getAllConsultants();
    res.status(200).json(consultants);
  } catch (error) {
    console.error("error in get all consultant", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// update information of Consultant
exports.updateConsultant = async (req, res) => {
  try {
    await updateConsultant(req.params.id, req.body);
    res.status(200).json({ message: "Consultant updated successfully" });
  } catch (error) {
    console.error("error in update consultant", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete Consultant
exports.deleteConsultant = async (req, res) => {
  try {
    await deleteConsultant(req.params.id);
    res.status(200).json({ message: "Consultant deleted successfully" });
  } catch (error) {
    console.error("error in delete consultant", error);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message }); // Trả về 404 nếu không tìm thấy
    }
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// add Doctor
exports.addDoctor = async (req, res) => {
  try {
    if (await checkDoctorEmailExists(req.body.email)) {
      throw new BadRequestError("Email is existed");
    }
    await addDoctor(req.user.id, req.body);
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error("error in add doctor ", error);
    if (error instanceof BadRequestError) {
      return res.status(400).json({ message: "Email is existed" });
    }
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// get doctor by id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    res.status(200).json(doctor);
  } catch (error) {
    console.error("error in get doctor by id", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all Doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("error in get all doctors", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// update information of Doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctorID = req.params.id;
    const doctorData = req.body;
    const doctorExists = await checkDoctorExists(doctorID);
    if (!doctorExists) {
      throw new NotFoundError("Doctor not found");
    }
    await updateDoctor(doctorID, doctorData);
    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error("error in update doctor", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await deleteDoctor(req.params.id);
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("error in delete doctor", error);
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message }); // Trả về 404 nếu không tìm thấy
    }
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

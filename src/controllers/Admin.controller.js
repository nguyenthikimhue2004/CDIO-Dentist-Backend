const { getAdminByEmail, registerAdmin } = require("../services/Admin.service");
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
  getAllDoctors,
} = require("../services/Doctor.service");

exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  // check input data
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // check if email is already registered
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // register admin
    await registerAdmin(email, password);

    // response
    return res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // check input data
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // check if email is registered
    const [admin] = await getAdminByEmail(email);
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate token
    const { accessToken, refreshToken } = generateToken({
      id: admin.id,
      email: admin.email,
      is_admin: true,
    });

    // response
    return res.status(200).json({
      message: "Login successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

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
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await getAllDoctors(req.user.id);
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

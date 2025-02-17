const bcrypt = require("bcrypt");
const consultantService = require("../services/Consultant.service");
const {
  validateLoginConsultant,
} = require("../validator/Consultant.validator");
const { validationResult } = require("express-validator");
const {
  UnauthorizedError,
  CustomError,
  NotFoundError,
} = require("../utils/exception");
const { generateToken } = require("../utils/jwt");
const {
  getConsultantByEmail,
  getDoctorSchedules,
  getAppointmentRequests,
} = require("../services/Consultant.service");

// Login Consultant
exports.loginConsultant = [
  validateLoginConsultant,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { email, id, password } = req.body;

    try {
      // check consultant exists
      const consultant = await getConsultantByEmail(email, id);
      if (!consultant) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // compare password
      const isPasswordValid = await bcrypt.compare(
        password,
        consultant.password
      );
      if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
      }

      // generate token
      const { accessToken, refreshToken } = generateToken({
        id: consultant.id,
        email: consultant.email,
        is_admin: false, // Consultant không phải là admin
      });

      // return token
      res.json({
        message: "Login successfully",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error in loginConsultant:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// get doctor schedule by doctor id
exports.getDoctorSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const schedules = await getDoctorSchedules(doctorId);
    if (!schedules) {
      throw new NotFoundError("Doctor not found");
    }
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error in get doctor schedule by doctor id", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get appointment requests
exports.getAppointmentRequests = async (req, res) => {
  try {
    const appointmentRequests = await getAppointmentRequests();
    res.status(200).json({ appointmentRequests });
  } catch (error) {
    console.error("error in get appointment request", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// confirm appointment request
exports.confirmAppointmentRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    // confirm appointment request
    await consultantService.confirmAppointmentRequest(requestId);
    res.status(200).json({ message: "Appointment request confirmed" });
  } catch (error) {
    console.error("error in confirm appointment request", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status: "confirmed" | "cancelled"
  try {
    await consultantService.updateAppointmentStatus(id, status);
    res
      .status(200)
      .json({ message: "Appointment status updated successfully" });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

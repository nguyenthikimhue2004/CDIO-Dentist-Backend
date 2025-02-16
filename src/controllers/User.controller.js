const { validationResult } = require("express-validator");
const { CustomError, BadRequestError } = require("../utils/exception");
const DoctorService = require("../services/Doctor.service");
const UserService = require("../services/User.service");
const { validateAppointment } = require("../validator/Appointment.validator");
// get list of doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorService.getAllDoctors();
    return res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error in getDoctors:", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// create appointment request
exports.createAppointment = [
  validateAppointment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // return validation errors
    }
    const { customer_name, customer_phone, doctor_name, appointment_time } =
      req.body;

    // check input data
    if (
      !customer_name ||
      !customer_phone ||
      !doctor_name ||
      !appointment_time
    ) {
      throw new BadRequestError("All fields are required");
    }

    try {
      // get id of doctor by name
      const doctor_id = await DoctorService.getDoctorIdByName(doctor_name);

      // create appointment request
      await UserService.createAppointmentRequest({
        customer_name,
        customer_phone,
        doctor_id,
        preferred_time: appointment_time,
      });

      return res
        .status(201)
        .json({ message: "Appointment request created successfully" });
    } catch (error) {
      console.error("Error in createAppointment:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
];

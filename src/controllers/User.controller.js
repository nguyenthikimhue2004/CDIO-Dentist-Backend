const { validationResult } = require("express-validator");
const { CustomError, BadRequestError } = require("../utils/exception");
const DoctorService = require("../services/Doctor.service");
const {
  createAppointmentRequest,
  getDoctorSchedules,
} = require("../services/User.service");
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
      .json({ message: "lỗi máy chủ nội bộ", error: error.message });
  }
};

// get schedule of a doctor
exports.getDoctorSchedules = async (req, res) => {
  try {
    const doctor_id = req.params.id;
    const schedules = await getDoctorSchedules(doctor_id);
    return res.status(200).json({ schedules });
  } catch (error) {
    console.error("Error in getDoctorSchedules:", error);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ message: "lỗi máy chủ nội bộ", error: error.message });
  }
};

// create appointment request
exports.createAppointment = [
  validateAppointment,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { customer_name, customer_phone, doctor_name, appointment_time } =
      req.body;

    try {
      // Check if doctor exists
      const doctorExists = await DoctorService.checkDoctorExistsByName(
        doctor_name
      );
      if (!doctorExists) {
        throw new BadRequestError("Không tìm thấy bác sĩ");
      }

      // Get the doctor's ID
      const doctor_id = await DoctorService.getDoctorIdByName(doctor_name);

      // Create the appointment request
      await createAppointmentRequest({
        customer_name,
        customer_phone,
        doctor_id,
        preferred_time: appointment_time,
      });

      return res
        .status(201)
        .json({ message: "Yêu cầu cuộc hẹn được tạo thành công" });
    } catch (error) {
      console.error("Error in createAppointment:", error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: "lỗi máy chủ nội bộ", error: error.message });
    }
  },
];

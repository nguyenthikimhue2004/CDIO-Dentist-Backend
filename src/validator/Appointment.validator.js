const { body, validationResult } = require("express-validator");
const moment = require("moment");

// Validation rules for creating an appointment
exports.validateAppointment = [
  body("customer_name").notEmpty().withMessage("Tên khách hàng được yêu cầu"), // Customer name must not be empty
  body("customer_phone")
    .matches(/^\d{10}$/)
    // / : start of regex
    // ^ : start of string
    // \d : any digit
    // {10} : exactly 10 times
    // $ : end of string
    // / : end of regex
    .withMessage("Số điện thoại của khách hàng phải có chính xác 10 chữ số"), // Phone number must be 10 digits
  body("doctor_name").isString().withMessage("Tên bác sĩ phải là một chuỗi"), // Tên bác sĩ phải là một chuỗi
  body("appointment_time")
    .custom((value) => {
      // Validate the format "hour:minute, day/month/year"
      const isValid = moment(value, "HH:mm, DD/MM/YYYY", true).isValid();
      if (!isValid) {
        throw new Error(
          "Định dạng ngày không hợp lệ. Sử dụng 'HH: MM, DD/MM/YYYY'"
        );
      }
      return true;
    })
    .withMessage("Định dạng ngày không hợp lệ. Sử dụng 'HH: MM, DD/MM/YYYY'"), // Custom validation for date format
];

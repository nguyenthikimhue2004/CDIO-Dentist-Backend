const { body, validationResult } = require("express-validator");
const moment = require("moment");

// Validation rules for creating an appointment
exports.validateAppointment = [
  body("customer_name").notEmpty().withMessage("Customer name is required"), // Customer name must not be empty
  body("customer_phone")
    .matches(/^\d{10}$/)
    // / : start of regex
    // ^ : start of string
    // \d : any digit
    // {10} : exactly 10 times
    // $ : end of string
    // / : end of regex
    .withMessage("Customer phone number must have exactly 10 digits"), // Phone number must be 10 digits
  body("doctor_name").isString().withMessage("Doctor name must be a string"), // Doctor name must be a string
  body("appointment_time")
    .custom((value) => {
      // Validate the format "hour:minute, day/month/year"
      const isValid = moment(value, "HH:mm, DD/MM/YYYY", true).isValid();
      if (!isValid) {
        throw new Error("Invalid date format. Use 'HH:mm, DD/MM/YYYY'");
      }
      return true;
    })
    .withMessage("Invalid date format. Use 'HH:mm, DD/MM/YYYY'"), // Custom validation for date format
];

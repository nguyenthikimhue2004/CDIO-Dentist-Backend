const { body, validationResult } = require("express-validator");

exports.validateAddConsultant = [
  body("name").notEmpty().withMessage("Name is required"), // Name must not be empty
  body("email").isEmail().withMessage("Invalid email format"), // Email must be valid
  body("phone")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must have exactly 10 digits"), // Phone number must be 10 digits
  body("location").notEmpty().withMessage("Location is required"), // Location must not be empty
  body("dob")
    .isISO8601()
    .toDate()
    .withMessage("Date of birth must be a valid date"), // Date of birth must be valid
  body("male").isBoolean().withMessage("Gender must be a boolean value"), // Gender must be boolean
  body("password").notEmpty().withMessage("Password is required"),
];

exports.validateLoginConsultant = [
  body("email").isEmail().withMessage("Invalid email format"), // Email must be valid
  body("password").notEmpty().withMessage("Password is required"), // Password must not be empty
];

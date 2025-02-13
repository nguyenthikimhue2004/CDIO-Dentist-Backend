const { body, validationResult } = require("express-validator");

// Validation rules for admin registration
exports.validateAdminRegistration = [
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => value === value.toLowerCase())
    .withMessage("Email must be in lowercase"), // Email must be valid
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"), // Password must be at least 6 characters
];

// Validation rules for admin login
exports.validateAdminLogin = [
  body("email").isEmail().withMessage("Invalid email format"), // Email must be valid
  body("password").notEmpty().withMessage("Password is required"), // Password must not be empty
];

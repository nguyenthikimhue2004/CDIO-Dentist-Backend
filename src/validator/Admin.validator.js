const { body, validationResult } = require("express-validator");

// Validation rules for admin registration
exports.validateAdminRegistration = [
  body("email")
    .isEmail()
    .withMessage("Định dạng email không hợp lệ")
    .custom((value) => value === value.toLowerCase())
    .withMessage("Email phải ở chữ thường"), // Email must be valid
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải dài ít nhất 6 ký tự"), // Password must be at least 6 characters
];

// Validation rules for admin login
exports.validateAdminLogin = [
  body("email").isEmail().withMessage("Định dạng email không hợp lệ"), // Email must be valid
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"), // Password must not be empty
];

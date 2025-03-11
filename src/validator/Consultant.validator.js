const { body, validationResult } = require("express-validator");

exports.validateAddConsultant = [
  body("name").notEmpty().withMessage("Bắt buộc nhập tên"), // Name must not be empty
  body("email").isEmail().withMessage("Định dạng email không hợp lệ"), // Email must be valid
  body("phone")
    .matches(/^\d{10}$/)
    .withMessage("Số điện thoại phải có chính xác 10 chữ số"), // Phone number must be 10 digits
  body("location").notEmpty().withMessage("Vị trí là bắt buộc"), // Location must not be empty
  body("dob")
    .isISO8601()
    .toDate()
    .withMessage("Ngày sinh phải là một ngày hợp lệ"), // Date of birth must be valid
  body("male").isBoolean().withMessage("Giới tính phải là một giá trị boolean"), // Gender must be boolean
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
];

exports.validateLoginConsultant = [
  body("email").isEmail().withMessage("Định dạng email không hợp lệ"), // Email must be valid
  body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"), // Password must not be empty
];

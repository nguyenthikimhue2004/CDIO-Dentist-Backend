const multer = require("multer");
const path = require("path");

// Lưu file vào thư mục cụ thể
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userType = req.baseUrl.includes("consultant")
      ? "consultants"
      : "doctors";
    cb(null, path.join(__dirname, "../public/img", userType));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Lọc file chỉ cho phép upload hình ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

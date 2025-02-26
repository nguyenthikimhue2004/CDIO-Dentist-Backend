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
    const { name } = req.body; // Lấy tên từ req.body
    if (!name) {
      return cb(new Error("Name is required to generate filename"), false);
    }

    const sanitizedName = name.toLowerCase().replace(/\s+/g, "-"); // Chuẩn hóa tên (ví dụ: "John Doe" -> "john-doe")
    const ext = path.extname(file.originalname); // Lấy đuôi file (ví dụ: .jpg, .png)
    const filename = `${sanitizedName}${ext}`; // Tạo tên file: john-doe.jpg

    cb(null, filename);
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

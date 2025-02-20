// import from external packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const AdminRoutes = require("./routes/v1/Admin.routes.js");
const UserRoutes = require("./routes/v1/User.routes.js");
const ConsultantRoutes = require("./routes/v1/Consultant.routes.js");
const path = require("path");
// import from internal packages
const { connect } = require("./config/db.config.js");
const errorHandler = require("./middleware/errorHandler.js");

// create an express app
const app = express();

// import port from .env file
const PORT = process.env.PORT || 5000;

// set static folder
app.use(express.static(path.join(__dirname, "public")));

//config req.body
app.use(express.json()); // for json
app.use(express.urlencoded({ extended: true })); // for form data

// connect db
connect();
// middleware
app.use(cors());

//
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/consultant", ConsultantRoutes);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup project Node.js và cấu trúc thư mục
// Cấu hình kết nối MySQL
// Tạo các model từ schema database
// Xây dựng các API endpoints
// Xử lý authentication/authorization
// Logic xử lý business

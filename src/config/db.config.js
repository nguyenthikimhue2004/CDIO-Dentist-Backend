// require("dotenv").config();
// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: process.env.DB_HOST, // Địa chỉ database
//   port: process.env.DB_PORT, // Cổng database
//   user: process.env.DB_USER, // Username
//   password: process.env.DB_PASS, // Password
//   database: process.env.DB_NAME, // Tên database
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// const connect = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("Database connected successfully");
//     connection.release();
//   } catch (error) {
//     console.error("Database connection failed:", error.message);
//   }
// };

// module.exports = { pool, connect };

require("dotenv").config();
const mysql = require("mysql2/promise");

// Hàm kiểm tra và tạo database nếu chưa tồn tại
const createDatabaseIfNotExists = async () => {
  try {
    // Tạo kết nối tạm thời không chỉ định database
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // Kiểm tra xem database đã tồn tại chưa
    const [rows] = await tempConnection.query(
      `SHOW DATABASES LIKE '${process.env.DB_NAME}'`
    );

    if (rows.length === 0) {
      // Nếu chưa tồn tại, tạo database mới
      await tempConnection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database '${process.env.DB_NAME}' created successfully`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' already exists`);
    }

    // Đóng kết nối tạm thời
    await tempConnection.end();
  } catch (error) {
    console.error("Error creating database:", error.message);
  }
};

// Tạo pool connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Hàm kết nối database
const connect = async () => {
  try {
    // Trước tiên, kiểm tra và tạo database nếu chưa tồn tại
    await createDatabaseIfNotExists();

    // Sau đó, kết nối với pool
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = { pool, connect };

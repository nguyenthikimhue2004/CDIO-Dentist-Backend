require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Địa chỉ database
  port: process.env.DB_PORT, // Cổng database
  user: process.env.DB_USER, // Username
  password: process.env.DB_PASS, // Password
  database: process.env.DB_NAME, // Tên database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connect = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = { pool, connect };

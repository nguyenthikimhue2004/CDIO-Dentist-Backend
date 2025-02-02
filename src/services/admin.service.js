const { pool } = require("../config/db.config");

exports.getAdminByEmail = async (email) => {
  const [admin] = await pool.execute("SELECT * FROM Admin WHERE email = ?", [
    email,
  ]);

  return admin;
};

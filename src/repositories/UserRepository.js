const pool = require('../config/database');

async function createUser(user) {
  const sql = `
    INSERT INTO Users (email, password_hash, role, createdAt, updatedAt)
    VALUES (?, ?, ?, NOW(), NOW())
  `;
  const params = [user.email, user.password_hash, user.role];
  const [result] = await pool.execute(sql, params);
  return result.insertId;
}

async function findUserByEmail(email) {
  const sql = 'SELECT * FROM Users WHERE email = ?';
  const [rows] = await pool.execute(sql, [email]);
  return rows[0];
}

async function findUserById(id) {
  const sql = 'SELECT * FROM Users WHERE id = ?';
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
}

async function getAllUsers() {
  const sql = 'SELECT id, email, role, createdAt, updatedAt FROM Users';
  const [rows] = await pool.execute(sql);
  return rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
};

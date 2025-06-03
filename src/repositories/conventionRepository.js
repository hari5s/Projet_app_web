const pool = require('../config/database');

async function createConvention(convention) {
  const sql = `
    INSERT INTO Conventions 
    (id, studentId, schoolId, companyId, content, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const params = [
    convention.id,
    convention.studentId,
    convention.schoolId,
    convention.companyId,
    convention.content,
    convention.status,
  ];
  const [result] = await pool.execute(sql, params);
  return result;
}

async function getConventionById(id) {
  const sql = 'SELECT * FROM Conventions WHERE id = ?';
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
}

async function getAllConventions() {
  const sql = 'SELECT * FROM Conventions';
  const [rows] = await pool.execute(sql);
  return rows;
}

async function updateConventionStatus(id, status) {
  const sql = 'UPDATE Conventions SET status = ?, updatedAt = NOW() WHERE id = ?';
  const [result] = await pool.execute(sql, [status, id]);
  return result;
}

module.exports = {
  createConvention,
  getConventionById,
  getAllConventions,
  updateConventionStatus,
};

const Convention = require('../models/convention');

async function create(conventionData) {
  return await Convention.create(conventionData);
}

async function findById(id) {
  return await Convention.findByPk(id);
}

async function findAll() {
  return await Convention.findAll();
}

async function findAllBySchoolId(schoolId) {
  console.log("--- REPOSITORY: Entrée dans findAllBySchoolId avec l'ID école:", schoolId); // <-- LIGNE 5
  return await Convention.findAll({
    where: { schoolId: schoolId }
  });
}

async function findAllByStudentId(studentId) {
  return await Convention.findAll({
    where: { studentId: studentId }
  });
}

async function findByCompletionToken(token) {
  return await Convention.findOne({ where: { completionToken: token } });
}

async function update(id, conventionData) {
  const convention = await Convention.findByPk(id);
  if (convention) {
    return await convention.update(conventionData);
  }
  return null;
}

module.exports = {
  create,
  findById,
  findAll,
  findAllBySchoolId,
  findAllByStudentId,
  findByCompletionToken,
  update,
};
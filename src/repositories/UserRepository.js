const User = require('../models/User');

async function create(userData) {
  const user = await User.create(userData);
  return user;
}

async function findByEmail(email) {
  return await User.findOne({ where: { email } });
}

async function findById(id) {
  return await User.findByPk(id);
}

async function findAll() {
  return await User.findAll({
    attributes: { exclude: ['password'] }
  });
}

module.exports = {
  create,
  findByEmail,
  findById,
  findAll,
};
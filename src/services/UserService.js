const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const validRoles = ['Student', 'School', 'Company'];

async function register(userData) {
  const { email, password, role, phoneNumber } = userData;

  if (!email || !password || !role) {
    throw new Error('Données manquantes (email, password, role)');
  }
  if (!validRoles.includes(role)) {
    throw new Error('Rôle invalide');
  }

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Email déjà utilisé');
  }

  const newUserPayload = {
    email,
    password,
    role,
    phoneNumber,
  };

  const newUser = await userRepository.create(newUserPayload);
  return newUser;
}

async function login(credentials) {
  const { email, password } = credentials;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('Authentification échouée');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Authentification échouée');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  return token;
}

async function getAllUsers() {
    return await userRepository.findAll();
}

module.exports = {
  register,
  login,
  getAllUsers,
};
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const { v4: uuidv4 } = require('uuid');
  const userRepository = require('../repositories/UserRepository');

  const SECRET_KEY = 'SECRET_KEY';

const validRoles = ['Student', 'School', 'Company'];

async function register(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role invalide. Choisissez parmi Student, School, Company.' });
    }

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password_hash: hashedPassword,
      role,
    };

    const userId = await userRepository.createUser(newUser);

    res.status(201).json({ message: 'Utilisateur créé', id: userId });
  } catch (error) {
    console.error('Erreur dans register :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}



  async function login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async function getUsers(req, res) {
    try {
      const users = await userRepository.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  module.exports = {
    register,
    login,
    getUsers,
  };

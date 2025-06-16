const userService = require('../services/UserService');

async function register(req, res) {
  try {
    const newUser = await userService.register(req.body);
    res.status(201).json({ message: 'Utilisateur créé', userId: newUser.id });
  } catch (error) {
    if (error.message.includes('Données manquantes') || error.message.includes('Rôle invalide') || error.message.includes('Email déjà utilisé')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function login(req, res) {
  try {
    const token = await userService.login(req.body);
    res.json({ token });
  } catch (error) {
    if (error.message === 'Authentification échouée') {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports = {
  register,
  login,
  getUsers
};
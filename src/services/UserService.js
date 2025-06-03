const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class UserService {
  async registerUser(email, password, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await UserRepository.create({ email, password: hashedPassword, role });
  }

  async loginUser(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Utilisateur non trouvé");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Mot de passe incorrect");

    return user;
  }

  async getUserById(id) {
    return await UserRepository.findById(id);
  }
}

module.exports = new UserService();

module.exports = UserService;

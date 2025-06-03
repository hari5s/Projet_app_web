const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

class UserService {
  async register(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      ...data,
      password: hashedPassword,
    });
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Email ou mot de passe invalide.");
    }
    const token = jwt.sign({ id: user.id, role: user.role }, "SECRET_KEY", {
      expiresIn: "1h",
    });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }
}

module.exports = UserService;

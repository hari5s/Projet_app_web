class UserController {
  constructor(service) {
    this.service = service;

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res) {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = UserController;

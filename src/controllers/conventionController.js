class ConventionController {
  constructor(service) {
    this.service = service;

    this.list = this.list.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async list(req, res) {
    const conventions = await this.service.listConventions();
    res.json(conventions);
  }

  async get(req, res) {
    const convention = await this.service.getConvention(req.params.id);
    if (!convention) return res.status(404).json({ message: "Convention non trouvée" });
    res.json(convention);
  }

  async create(req, res) {
    try {
      const convention = await this.service.createConvention(req.body);
      res.status(201).json(convention);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const convention = await this.service.updateConvention(req.params.id, req.body);
      if (!convention) return res.status(404).json({ message: "Convention non trouvée" });
      res.json(convention);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async delete(req, res) {
    const deleted = await this.service.deleteConvention(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Convention non trouvée" });
    res.status(204).send();
  }
}

module.exports = ConventionController;

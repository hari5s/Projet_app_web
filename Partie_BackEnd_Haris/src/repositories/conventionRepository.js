const Convention = require("../models/convention");
const { v4: uuidv4 } = require("uuid");

class ConventionRepository {
  constructor() {
    this.conventions = [];
  }

  async getAll() {
    return this.conventions;
  }

  async getById(id) {
    return this.conventions.find(c => c.id === id) || null;
  }

  async create(data) {
    const convention = new Convention({
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    });
    this.conventions.push(convention);
    return convention;
  }

  async update(id, data) {
    const index = this.conventions.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.conventions[index] = {
      ...this.conventions[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.conventions[index];
  }

  async delete(id) {
    const index = this.conventions.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.conventions.splice(index, 1);
    return true;
  }
}

module.exports = ConventionRepository;

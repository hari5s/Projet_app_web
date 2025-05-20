class ConventionService {
  constructor(repository) {
    this.repository = repository;
  }

  async listConventions() {
    return this.repository.getAll();
  }

  async getConvention(id) {
    return this.repository.getById(id);
  }

  async createConvention(data) {
    if (!["En attente", "Signée", "Refusée", "À signer"].includes(data.status)) {
      throw new Error("Statut invalide");
    }
    return this.repository.create(data);
  }

  async updateConvention(id, data) {
    if (data.status && !["En attente", "Signée", "Refusée", "À signer"].includes(data.status)) {
      throw new Error("Statut invalide");
    }
    return this.repository.update(id, data);
  }

  async deleteConvention(id) {
    return this.repository.delete(id);
  }
}

module.exports = ConventionService;

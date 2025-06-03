const { v4: uuidv4 } = require('uuid');
const conventionRepository = require('../repositories/conventionRepository');

async function createConvention(req, res) {
  try {
    const { studentId, schoolId, companyId, content, status } = req.body;
    const newConvention = {
      id: uuidv4(),
      studentId,
      schoolId,
      companyId,
      content,
      status: status || "En attente",
    };
    await conventionRepository.createConvention(newConvention);
    res.status(201).json({ message: 'Convention créée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getConvention(req, res) {
  try {
    const { id } = req.params;
    const convention = await conventionRepository.getConventionById(id);
    if (!convention) {
      return res.status(404).json({ message: 'Convention non trouvée' });
    }
    res.json(convention);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getAllConventions(req, res) {
  try {
    const conventions = await conventionRepository.getAllConventions();
    res.json(conventions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await conventionRepository.updateConventionStatus(id, status);
    res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

module.exports = {
  createConvention,
  getConvention,
  getAllConventions,
  updateStatus,
};

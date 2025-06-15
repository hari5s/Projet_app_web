const conventionService = require('../services/conventionService');

async function createConvention(req, res) {
  try {
    const newConvention = await conventionService.createConvention(req.body);
    res.status(201).json(newConvention);
  } catch (error) {
    if (error.message.includes('requis') || error.message.includes('n\'existe pas')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getConvention(req, res) {
  try {
    const { id } = req.params;
    const convention = await conventionService.getConventionById(id);
    res.json(convention);
  } catch (error) {
    if (error.message === 'Convention non trouvée') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function getAllConventions(req, res) {
  try {
    const loggedInUser = req.user;
    let conventions;
    if (loggedInUser.role === 'School') {
      conventions = await conventionService.getConventionsForSchool(loggedInUser.id);
    } else {
      conventions = []; 
    }
    res.json(conventions);
  } catch (error) {
    console.error("Erreur dans getAllConventions:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedConvention = await conventionService.updateConventionStatus(id, status);
    res.json({ message: 'Statut mis à jour', convention: updatedConvention });
  } catch (error) {
    if (error.message === 'Statut invalide') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('non trouvée')) {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function signConvention(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    const updatedConvention = await conventionService.signConvention(id, user);
    res.json({ message: 'Convention signée avec succès.', convention: updatedConvention });
  } catch (error) {
    if (error.message.includes('non trouvée') || error.message.includes('non autorisée')) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes('déjà signé')) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Erreur dans signConvention:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function initiate(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;
    const conventionWithToken = await conventionService.initiateConvention(id, user);
    res.json({ 
      message: 'Lien de complétion généré.', 
      completionToken: conventionWithToken.completionToken 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getPublic(req, res) {
  try {
    const { token } = req.params;
    const convention = await conventionService.getConventionByToken(token);
    res.json(convention);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function completePublic(req, res) {
  try {
    const { token } = req.params;
    const updatedConvention = await conventionService.completeConventionByToken(token, req.body);
    res.json({ message: 'Convention complétée avec succès.', convention: updatedConvention });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createConvention,
  getConvention,
  getAllConventions,
  updateStatus,
  signConvention,
  initiate,
  getPublic,
  completePublic,
};
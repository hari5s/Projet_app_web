const conventionService = require('../services/conventionService');

async function create(req, res) {
  try {
    const convention = await conventionService.createConventionBySchool(req.user.id, req.body);
    res.status(201).json(convention);
  } catch (error) { res.status(400).json({ message: error.message }); }
}

async function getPublic(req, res) {
      console.log("--- CONTRÔLEUR: Tentative de création par l'utilisateur avec ID:", req.user?.id, "et rôle:", req.user?.role);
    try {
        const type = req.path.includes('/student/') ? 'student' : 'company';
        const convention = await conventionService.getConventionByToken(req.params.token, type);
        res.json(convention);
    } catch (error) { res.status(404).json({ message: error.message }); }
}

async function completeStudent(req, res) {
    try {
        const convention = await conventionService.completeByStudent(req.params.token, req.body);
        res.json(convention);
    } catch (error) { res.status(400).json({ message: error.message }); }
}

async function completeCompany(req, res) {
    try {
        const convention = await conventionService.completeByCompany(req.params.token, req.body);
        res.json(convention);
    } catch (error) { res.status(400).json({ message: error.message }); }
}

async function getForUser(req, res) {
  console.log("--- CONTRÔLEUR: Entrée dans getForUser pour le rôle:", req.user.role); // <-- LIGNE 1
  try {
    const conventions = await conventionService.getConventionsForUser(req.user);
    res.json(conventions);
  } catch (error) {
    console.error("--- ERREUR CAPTURÉE DANS LE CONTRÔLEUR getForUser ---", error); // <-- LIGNE 2
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

async function sign(req, res) {
    try {
        const convention = await conventionService.signConvention(req.params.id, req.user);
        res.json(convention);
    } catch (error) { res.status(400).json({ message: error.message }); }
}

// ... Ajoutez ici d'autres contrôleurs si nécessaire (getById etc.)

module.exports = { create, getPublic, completeStudent, completeCompany, getForUser, sign };
const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');

// Pour que l'étudiant/entreprise puisse voir les infos pré-remplies
router.get('/student/:token', conventionController.getPublic);
router.get('/company/:token', conventionController.getPublic);

// Pour soumettre les formulaires de complétion
router.post('/student/:token', conventionController.completeStudent);
router.post('/company/:token', conventionController.completeCompany);

module.exports = router;
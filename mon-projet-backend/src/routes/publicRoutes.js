const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');

// Route pour que l'entreprise puisse voir la convention
router.get('/conventions/:token', conventionController.getPublic);

// Route pour que l'entreprise puisse soumettre ses informations
router.post('/conventions/:token/complete', conventionController.completePublic);

module.exports = router;
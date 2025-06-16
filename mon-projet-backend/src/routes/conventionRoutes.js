const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);

router.post('/', conventionController.createConvention);
router.get('/', conventionController.getAllConventions);
router.get('/:id', conventionController.getConvention);
router.put('/:id/status', conventionController.updateStatus);
router.post('/:id/sign', conventionController.signConvention);

// Route pour que l'étudiant génère le lien pour l'entreprise
router.post('/:id/initiate', conventionController.initiate);

module.exports = router;
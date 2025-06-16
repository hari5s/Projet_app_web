const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const authenticateToken = require('../middlewares/authenticateToken');

// On retire la ligne "router.use(authenticateToken);"

// On ajoute 'authenticateToken' directement sur chaque route qui en a besoin

// Pour créer une convention, il faut être connecté
router.post('/', authenticateToken, conventionController.create);

// Pour voir son dashboard, il faut être connecté
router.get('/', authenticateToken, conventionController.getForUser);

// Pour signer, il faut être connecté
router.post('/:id/sign', authenticateToken, conventionController.sign);


module.exports = router;
const express = require('express');
const router = express.Router();
const conventionController = require('../controllers/conventionController');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/', authenticateToken, conventionController.createConvention);
router.get('/', authenticateToken, conventionController.getAllConventions);
router.get('/:id', authenticateToken, conventionController.getConvention);
router.put('/:id/status', authenticateToken, conventionController.updateStatus);

module.exports = router;

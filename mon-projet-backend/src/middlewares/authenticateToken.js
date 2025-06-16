// src/middlewares/authenticateToken.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès interdit: token manquant' });
  }

  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userPayload;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = authenticateToken;
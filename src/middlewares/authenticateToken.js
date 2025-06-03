const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Accès interdit" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], "SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide" });
  }
}

module.exports = authenticateToken;

// app.js
const express = require("express");
const conventionRoutes = require("./routes/conventionRoutes");
const userRoutes = require("./routes/UserRoutes");
const app = express();

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Ajout des routes utilisateur
app.use("/api/users", userRoutes);

// Route principale pour gérer les conventions
app.use("/api/conventions", conventionRoutes);

module.exports = app;

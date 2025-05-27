// app.js
const express = require("express");
const conventionRoutes = require("./routes/conventionRoutes");

const app = express();

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Route principale pour gérer les conventions
app.use("/api/conventions", conventionRoutes);

module.exports = app;

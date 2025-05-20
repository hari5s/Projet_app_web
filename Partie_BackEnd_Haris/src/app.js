const express = require("express");
const conventionRoutes = require("./routes/conventionRoutes");

const app = express();

app.use(express.json());

app.use("/api/conventions", conventionRoutes);

module.exports = app;

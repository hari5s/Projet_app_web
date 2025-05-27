const { Sequelize } = require("sequelize");

// Configuration de la connexion MySQL
const sequelize = new Sequelize("gestion_stages", "admin", "password", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
  logging: console.log,
});

// Vérification de la connexion
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à MySQL réussie !");
  } catch (error) {
    console.error("Erreur lors de la connexion à MySQL :", error);
  }
})();

module.exports = sequelize;

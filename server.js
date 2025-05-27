// server.js
const app = require("./src/app");
const sequelize = require("./src/config/database");
const ConventionModel = require("./src/models/convention");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Synchronisation des modèles avec la base de données
    await sequelize.sync({ force: true });
    console.log("Base de données synchronisée !");

    // Lancement du serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors de la synchronisation :", error);
  }
})();

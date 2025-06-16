require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');
const { setupEmail } = require('./src/services/emailService'); 
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Connexion à la base de données réussie.');

    await setupEmail();

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur:', error);
  }
}

startServer();
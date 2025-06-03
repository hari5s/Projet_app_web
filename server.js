const express = require('express');
const app = express();
const UserRoutes = require('./src/routes/UserRoutes');
app.use(express.json());

app.use('/users', UserRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

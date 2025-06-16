const express = require('express');
const cors = require('cors'); 
const app = express();

const userRoutes = require('./routes/UserRoutes');
const conventionRoutes = require('./routes/conventionRoutes');
const publicRoutes = require('./routes/publicRoutes'); 

app.use(cors());
app.use(express.json());

app.use('/public', publicRoutes);

app.use('/api/users', userRoutes);
app.use('/api/conventions', conventionRoutes);

module.exports = app;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes constants
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/adminLogistic');
const userAuthRoutes = require('./routes/usersAuth');
const productsRoutes = require('./routes/products');

const app = express();

console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET);

// Usa el puerto asignado por Render, si está disponible, o 10000 como fallback
const port = process.env.PORT || 10000;

// Configurar CORS con opciones específicas
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',  // Reemplaza CLIENT_URL con la URL de tu frontend en producción
  allowedHeaders: ['Content-Type', 'Authorization'],  // Permitir 'Authorization' para JWT
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Métodos permitidos
};
app.use(cors(corsOptions));  // Aplica la configuración de CORS

// Middleware
app.use(express.json()); // Parseo de JSON


// Import Routes
app.use('/user', userRoutes);
app.use('/admin-logistic', adminRoutes);
app.use('/auth', userAuthRoutes);
app.use('/products', productsRoutes);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the backend');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error);
  });

// Solo una llamada a app.listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

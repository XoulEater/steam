const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//Routes constants
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/adminLogistic');
const userAuthRoutes = require('./routes/usersAuth');
const productsRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(cors()); // Para permitir peticiones de diferentes dominios

//Import Routes
app.use('/user', userRoutes);
app.use('/admin-logistic', adminRoutes);
app.use('/auth', userAuthRoutes);
app.use('/products', productsRoutes);


//Routes
app.get('/', (req, res) => {
    res.send('Welcome to the backend');
});

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error);
    })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


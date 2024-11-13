const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userAuthSchema = require("../models/usersAuth");
const userSchema = require("../models/user");
const adminLogisticSchema = require("../models/adminLogistic");



const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const userAuth = await userAuthSchema.findOne({ email });
    if (!userAuth) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    // Buscar en la colección de usuarios
    let user = await userSchema.findById(userAuth.userId);

    // Buscar en la colección de adminLogistic
    if (!user) {
      user = await adminLogisticSchema.findById(userAuth.userId);
    }

    // Si no se encuentra en ninguna colección
    if (!user) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Determinar el rol
    let role = user.role;

    // Crear token usando el `username` de la colección `userAuth`
    const token = jwt.sign(
      {
        id: userAuth.userId,
        email,
        role,
        username: userAuth.username, 
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Sesión iniciada correctamente",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        image: user.image || "",
        username: userAuth.username, 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});


module.exports = router;

const express = require("express");
const bcrypt = require('bcryptjs');  
const dotenv = require("dotenv");
const userSchema = require("../models/user");
const userAuthSchema = require("../models/usersAuth");
const cartSchema = require("../models/cart");
const wishlistSchema = require("../models/wishlist");
const auth = require("../middleware/authMiddleware");

dotenv.config();

const router = express.Router();

// Registrar usuario
router.post("/registerUser", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe
        const verifyUser = await userSchema.findOne({ email: email });
        if (verifyUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Crear un carrito para el usuario
        const newCart = new cartSchema({
            products: [],
            quantity: 0,
            price: 0,
        });

        const savedCart = await newCart.save();

        // Crear wishlist al usuario
        const newWishlist = new wishlistSchema({
            wishProducts: [],
        });

        const savedWishlist = await newWishlist.save();

        // Crear un nuevo usuario en la colección `users`
        const newUser = new userSchema({
            username: username,  
            email: email,
            password: hashPassword,
            role: "user",
            image: "",
            cart: savedCart._id,
            paymentMethods: [],
            wishlist: savedWishlist._id,
            orderHistory: [],
        });

        const savedUser = await newUser.save();

        // Crear un nuevo usuario en la colección `usersAuth` con el email y userId
        const newUserAuth = new userAuthSchema({
            email: email,
            userId: savedUser._id.toString(),  
        });

        await newUserAuth.save();

        res.status(201).json({
            message: "Usuario registrado",
            user: savedUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al registrar el usuario",
            error: error,
        });
    }
});

//Editar usuario
router.put("/editUser", auth("user"), async (req, res) => {
    try {
      const { email, password, username } = req.body;
      const userId = req.user.id; // El ID del usuario está disponible gracias al middleware de verificación del token.
  
      // Buscar al usuario por ID
      const user = await userSchema.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Si se proporciona un nuevo correo electrónico, lo actualizamos
      if (email) {
        user.email = email; // Actualizamos el correo en la colección `users`
        
        // Actualizamos también el correo en la colección `usersAuth`
        const userAuth = await userAuthSchema.findOne({ userId: userId });
        if (userAuth) {
          userAuth.email = email;
          await userAuth.save();  // Guardamos los cambios en `usersAuth`
        }
      }
  
      // Si se proporciona un nuevo nombre de usuario, lo actualizamos
      if (username) {
        user.username = username;
      }
  
      // Si se proporciona una nueva contraseña, la encriptamos y la actualizamos
      if (password) {
        const salt = await bcrypt.genSalt(10);  
        user.password = await bcrypt.hash(password, salt); 
      }
  
      // Guardar los cambios en la colección `users`
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: "Usuario actualizado correctamente",
        user: updatedUser,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
});
  

module.exports = router;

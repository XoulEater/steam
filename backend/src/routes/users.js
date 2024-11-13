const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userSchema = require("../models/user");
const userAuthSchema = require("../models/usersAuth");
const cartSchema = require("../models/cart");
const wishlistSchema = require("../models/wishList");
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
      cart: savedCart._id.toString(),
      paymentMethods: [],
      wishlist: savedWishlist._id.toString(),
      orderHistory: [],
    });

    const savedUser = await newUser.save();

    // Crear un nuevo usuario en la colección `usersAuth` con el email y userId
    const newUserAuth = new userAuthSchema({
      username: username,
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
    const { email, password, username, image } = req.body;
    const userId = req.user.id; 

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
        await userAuth.save(); 
      }
    }

    // Si se proporciona un nuevo nombre de usuario, lo actualizamos
    if (username) {
      const verifyUsername = await userSchema.findOne({ username: username });
      if (verifyUsername) {
        return res.status(400).json({ message: "El nombre de usuario ya existe" });
      }

      user.username = username; // Actualizamos el nombre de usuario en la colección `users`

      // Actualizamos también el nombre de usuario en la colección `usersAuth`
      const userAuth = await userAuthSchema.findOne({ userId: userId });
      if (userAuth) {
        userAuth.username = username;
        await userAuth.save();
      }
    }

    // Si se proporciona una nueva contraseña, la encriptamos y la actualizamos
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Si se proporciona una nueva imagen, la actualizamos
    if (image) {
      user.image = image; // Actualizamos la imagen en la colección `users`
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

router.delete("/deleteUser", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar al usuario por ID en la colección `users`
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminar el usuario de la colección `users`
    await userSchema.findByIdAndDelete(userId);

    //Eliminar el usuario de la colección `usersAuth`
    const userAuth = await userAuthSchema.findOne({ userId: userId });
    if (userAuth) {
      await userAuthSchema.findByIdAndDelete(userAuth._id);
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
});

//TODO: Get historial de ordenes de un usuario
router.get("/orderHistory", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar al usuario por ID en la colección `users`
    const user = await userSchema.findById(userId)
    if(!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: `Historial de ordenes de ${req.user.username} obtenido correctamente`, orderHistory: user.orderHistory });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el historial de ordenes", error }); 
  }
});

module.exports = router;

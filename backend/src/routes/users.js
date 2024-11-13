const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userSchema = require("../models/user");
const userAuthSchema = require("../models/usersAuth");
const cartSchema = require("../models/cart");
const wishlistSchema = require("../models/wishList");
const productSchema = require("../models/products");
const auth = require("../middleware/authMiddleware");

dotenv.config();

const router = express.Router();

// Registrar usuario
router.post("/registerUser", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe en la colección `users`
    const verifyUser = await userSchema.findOne({ email: email });
    if (verifyUser) {
      return res.status(400).json({ message: "El usuario ya existe en users" });
    }

    // Verificar si el email ya está registrado en la colección `usersAuth`
    const verifyUserAuth = await userAuthSchema.findOne({ email: email });
    if (verifyUserAuth) {
      return res.status(400).json({ message: "El email ya está registrado en usersAuth" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Crear un carrito para el usuario
    const newCart = new cartSchema({
      products: [],
      totalPrice: 0,
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
      message: "Usuario registrado correctamente",
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

// Eliminar usuario
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

//Obtener el historial de compras del usuario
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

//Obtener el carrito del usuario
router.get("/userCart", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar al usuario por ID en la colección `users`
    const user = await userSchema.findById(userId);
    if(!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Buscar el carrito del usuario
    const cart = await cartSchema.findById(user.cart);

    res.status(200).json({
      message: `Carrito de ${req.user.username} obtenido correctamente`,
      cart: cart
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito del usuario", error });
  }
});

//Agregar producto al carrito del usuario
//!!! Falta que si se agrega un producto se reste del stock
//??? Hay que hacer con la colección de inventario ???
router.post("/addToCart", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Buscar al usuario por ID en la colección `users`
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Buscar el carrito del usuario
    let cart = await cartSchema.findById(user.cart);
    if (!cart) {
      return res.status(400).json({ message: "Carrito no encontrado" });
    }

    // Verificar que hay producto en stock
    const product = await productSchema.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    // Verificar si hay suficiente stock
    if (product.stock < quantity) {
      return res.status(400).json({
        message: `No hay suficiente stock para agregar al carrito, solo quedan ${product.stock}`,
      });
    }

    // Restar el stock del producto
    product.stock -= quantity;
    await product.save(); 

    // Verificar si el producto ya está en el carrito
    const productExisting = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productExisting > -1) {
      // Si el producto ya está en el carrito, solo aumentar la cantidad
      cart.products[productExisting].quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo con el precio con descuento, si corresponde
      let finalPrice = product.price;
      if (product.discount > 0) {
        finalPrice = product.price - (product.price * product.discount) / 100;
      }
      cart.products.push({
        productId,
        quantity,
        price: finalPrice,
      });
    }

    // Calcular el precio total del carrito
    cart.totalPrice = cart.products.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    // Guardar los cambios en el carrito
    await cart.save();

    res.status(200).json({
      message: `Producto agregado al carrito de ${req.user.username} correctamente`,
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el producto al carrito del usuario",
      error: error.message || error,
    });
  }
});

//Eliminar producto del carrito del usuario
//!!! Falta hacer que si elimina el producto, se sume al stock
//??? Hay que hacer con la colección de inventario ???
router.delete("/deleteFromCart", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Buscar al usuario por ID en la colección `users`
    const user = await userSchema.findById(userId);
    if(!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Buscar el carrito del usuario
    let cart = await cartSchema.findById(user.cart);
    if (!cart) {
      return res.status(400).json({ message: "Carrito no encontrado" });
    }

    // Verificar si el producto está en el carrito
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(400).json({ message: "Producto no encontrado en el carrito" });
    }

    // Obtener el producto para actualizar el stock
    const product = await productSchema.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    // Si el producto tiene stock suficiente en el carrito, lo resta al carrito y agrega al stock
    if (cart.products[productIndex].quantity > quantity) {
      cart.products[productIndex].quantity -= quantity;
      // Aumentar el stock del producto
      product.stock += quantity;
    } else {
      // Si la cantidad en el carrito es menor o igual a la cantidad a eliminar, lo elimina completamente del carrito
      const removedQuantity = cart.products[productIndex].quantity;
      cart.products.splice(productIndex, 1);
      // Aumentar el stock del producto
      product.stock += removedQuantity;
    }

    // Recalcular el precio total del carrito
    cart.totalPrice = cart.products.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    // Guardar los cambios en el carrito y en el producto
    await cart.save();
    await product.save();

    res.status(200).json({
      message: `Producto eliminado del carrito de ${req.user.username} correctamente`,
      cart: cart,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito del usuario",
      error: error.message || error,
    });
  }
});

module.exports = router;

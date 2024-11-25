const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const userSchema = require("../models/user");
const userAuthSchema = require("../models/usersAuth");
const cartSchema = require("../models/cart");
const wishlistSchema = require("../models/wishList");
const productSchema = require("../models/products");
const adminLogisticSchema = require("../models/adminLogistic");
const discountSchema = require("../models/discount");
const auth = require("../middleware/authMiddleware");
const Order = require("../models/order");
const products = require("../models/products");

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
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: `Historial de ordenes de ${req.user.username} obtenido correctamente`, orderHistory: user.orderHistory });

    // TODO: Esto devuelve los IDs de las ordenes, falta devolver los detalles de las ordenes?


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
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Buscar el carrito del usuario y poblar los productos
    const cart = await cartSchema.findById(user.cart).populate({
      path: "products.productId",
      select: "-__v -createdAt -updatedAt",
    });

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json({
      message: `Carrito de ${req.user.username} obtenido correctamente`,
      cart: cart,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el carrito del usuario",
      error: error.message || error,
    });
  }
});

//Agregar producto al carrito del usuario
router.post("/addToCart", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    //Verificar usuario
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    //Buscar el carrito del usuario
    let cart = await cartSchema.findById(user.cart);
    if (!cart) {
      return res.status(400).json({ message: "Carrito no encontrado" });
    }

    //Verificar si el producto existe
    const product = await productSchema.findById(productId).populate("discount");
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    //Verificar si el producto está en stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Producto sin stock suficiente, solo quedan ${product.stock}` });
    }

    //Calcular el precio del producto
    let price = product.price;

    //Verificar si el producto tiene descuento

    if (product.discount) {
      const { type, value, validDate } = product.discount;

      //Verificar si el descuento es vigente
      const untilDate = new Date(validDate);
      const today = new Date();

      console.log("Fecha de vencimiento del descuento: ", untilDate);
      console.log("Fecha de hoy: ", today);

      if (today <= untilDate) {
        if (type === "percentage") {
          price = price - (price * value / 100);
        } else if (type === "fixed") {
          price = Math.max(0, product.price - value);
        }
      }
    }

    //Verificar si el producto ya está en el carrito
    const productExisting = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productExisting !== -1) {
      cart.products[productExisting].quantity += quantity;
    } else {
      //Agregar el producto al carrito
      cart.products.push({
        productId,
        quantity,
        price: price,
      });
    }

    //Actualizar el stock del producto
    product.stock -= quantity;

    //Notificar a los admins que ya casi no hay stock
    if (product.stock > 0 && product.stock <= 5) {
      const admins = await adminLogisticSchema.find({ role: "admin" });
      const notification = `¡Alerta! El producto ${product.name} tiene poco stock, solo quedan ${product.stock} unidades`;

      //Notificar a cada admin
      for (const admin of admins) {
        admin.notifications.push(notification);
        await admin.save();
      }
    }

    await product.save();

    //Recalcular el precio total del carrito
    cart.totalPrice = cart.products.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);

    //Guardar los cambios en el carrito
    await cart.save();

    res.status(200).json({
      message: `Producto agregado al carrito de ${req.user.username} correctamente`,
      cart: cart,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al agregar producto al carrito del usuario",
      error: error.message || error,
    });
  }
});

//Eliminar producto del carrito del usuario
router.delete("/deleteFromCart", auth("user"), async (req, res) => {
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

    // Verificar si el producto está en el carrito
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(400).json({ message: "Producto no encontrado en el carrito" });
    }

    // Verificar si la cantidad a eliminar es válida
    if (cart.products[productIndex].quantity < quantity) {
      return res.status(400).json({ message: `No puedes eliminar más de lo que hay en el carrito. Solo tienes ${cart.products[productIndex].quantity} unidades de este producto.` });
    }

    // Buscar el producto
    const product = await productSchema.findById(productId).populate("discount");
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    // Si la cantidad en el carrito es mayor que la cantidad que se desea eliminar
    if (cart.products[productIndex].quantity > quantity) {
      cart.products[productIndex].quantity -= quantity;
      // Aumentar el stock en el producto
      product.stock += quantity;
    } else {
      // Si la cantidad a eliminar es igual o mayor que la cantidad en el carrito, eliminar el producto del carrito
      const removedQuantity = cart.products[productIndex].quantity;
      cart.products.splice(productIndex, 1);
      // Aumentar el stock en el producto
      product.stock += removedQuantity;
    }

    // Calcular el precio con descuento si lo tiene
    let price = product.price;
    if (product.discount) {
      const { type, value, validDate } = product.discount;

      // Verificar si el descuento es vigente
      if (new Date(validDate) >= new Date()) {
        if (type === "percentage") {
          price = price - (price * value / 100);
        } else if (type === "fixed") {
          price = Math.max(0, product.price - value);
        }
      }
    }

    // Recalcular el precio total del carrito
    cart.totalPrice = cart.products.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);

    // Guardar los cambios en el carrito y el producto
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

// Obtener la wishlist del usuario
router.get("/userWishlist", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar el usuario
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Buscar la wishlist del usuario y poblar los productos
    const wishlist = await wishlistSchema
      .findById(user.wishlist)
      .populate("wishProducts");

    if (!wishlist) {
      return res.status(400).json({ message: "Wishlist no encontrada" });
    }

    res.status(200).json({
      message: `Wishlist de ${req.user.username} obtenida correctamente`,
      wishlist: wishlist,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la wishlist del usuario",
      error: error.message || error,
    });
  }
});


//Agregar producto a la wishlist del usuario
router.post("/addToWishlist", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    //Buscar el usuario
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    //Buscar el producto
    const product = await productSchema.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    //Buscar la wishlist del usuario
    const wishlist = await wishlistSchema.findById(user.wishlist);
    if (!wishlist) {
      return res.status(400).json({ message: "Wishlist no encontrada" });
    }

    //Verificar si el producto ya está en la wishlist
    const productExisting = wishlist.wishProducts.findIndex(
      (item) => item.toString() === productId
    );

    if (productExisting !== -1) {
      return res.status(400).json({ message: "Producto ya está en la wishlist" });
    }

    //Agregar el ID del producto a la wishlist
    wishlist.wishProducts.push(productId);

    //Guardar los cambios en la wishlist
    await wishlist.save();

    res.status(200).json({
      message: `Producto agregado a la wishlist de ${req.user.username} correctamente`,
      wishlist: wishlist,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al agregar producto a la wishlist del usuario",
      error: error.message || error,
    });
  }
});

//Eliminar producto de la wishlist del usuario
router.delete("/deleteFromWishlist", auth("user"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    //Buscar el usuario
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    //Buscar la wishlist del usuario
    const wishlist = await wishlistSchema.findById(user.wishlist);
    if (!wishlist) {
      return res.status(400).json({ message: "Wishlist no encontrada" });
    }

    //Verificar si el producto está en la wishlist
    const productIndex = wishlist.wishProducts.findIndex(
      (item) => item.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(400).json({ message: "Producto no encontrado en la wishlist" });
    }

    //Eliminar el producto de la wishlist
    wishlist.wishProducts.splice(productIndex, 1);

    //Guardar los cambios en la wishlist
    await wishlist.save();

    res.status(200).json({
      message: `Producto eliminado de la wishlist de ${req.user.username} correctamente`,
      wishlist: wishlist,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto de la wishlist del usuario",
      error: error.message || error,
    });
  }
});

// Transforma lo que esta en el carrito del usuario a la orden de compra
router.post('/addOrder', async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const username = decoded.username;
    if (!username) {
      return res.status(400).json({ message: "No se encontro el nombre del usuario en el token" });
    }

    // Encontrar el user
    const user = await userSchema.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const cart = await cartSchema.findOne({ _id: user.cart });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Tomar los productos del carrito y su precio para concretar la orden
    purchasedProducts = cart.products.map(item => ({ product: item.productId }));
    price = cart.totalPrice;

    const order = new Order({
      purchasedProducts,
      price,
      orderStatus: "pending",
    });

    const savedOrder = await order.save();

    // Actualizar el historial de órdenes del usuario
    user.orderHistory.push(savedOrder._id);
    await user.save();

    // Limpiar el carrito del usuario
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: `Orden añadida por el usuario: ${username}`, order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Error al insertar orden" });
  }
});

// TODO: Este endpoint trae toda la informacion de un producto, limitar a solamente lo que 
// TODO: necesitan desde el frontend para mejor rendimiento.
// Obtiene todas las ordenes de un usuario
router.get('/getOrders', async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const username = decoded.username;
    if (!username) {
      return res.status(400).json({ message: "No se encontro el nombre del usuario en el token" });
    }

    // Encontrar el user
    const user = await userSchema.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const orders = await Order.find({ _id: { $in: user.orderHistory } }).populate('purchasedProducts.product');

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Error al obtener las órdenes" });
  }
});

// Modifica el estado de una orden
router.put('/editOrderStatus/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    // Verificar que el nuevo estado de la orden es válido
    const validStatuses = ["pending", "inPreparation", "sent", "delivered"];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Estado de la orden no válido" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ message: "Estado de la orden actualizado", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el estado de la orden" });
  }
});

module.exports = router;

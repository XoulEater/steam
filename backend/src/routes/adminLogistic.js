const express = require("express");
const bcrypt = require("bcryptjs");
const adminLogisticSchema = require("../models/adminLogistic");
const userSchema = require("../models/user");
const userAuthSchema = require("../models/usersAuth");
const cartSchema = require("../models/cart");
const wishlistSchema = require("../models/wishList");
const auth = require("../middleware/authMiddleware");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post("/registerAdminLogistic", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //Verificar si el usuario ya existe
        const verifyAdmin = await adminLogisticSchema.findOne({ email: email });
        if (verifyAdmin) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //Crear un nuevo usuario
        const newAdminLogistic = new adminLogisticSchema({
            username: username,
            email: email,
            password: hashPassword,
            role: role,
            notifications: [],
        });

        //Guardar el usuario en la base de datos
        const savedAdminLogistic = await newAdminLogistic.save();

        //Agregar el usuairo a usersAuth
        const newUserAuth = new userAuthSchema({
            username: username,
            email: email,
            userId: savedAdminLogistic._id.toString(),
        });

        await newUserAuth.save();

        res.status(201).json({
            message: "Usuario admin-logistic creado exitosamente",
            user: savedAdminLogistic,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el admin-logistic",
            error: error,
        });
    }
});

// Edit admin/logistic user
router.put("/editAdminLogistic", auth(["admin", "logistic"]), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const adminLogisticId = req.user.id;

        // Verificar si el usuario admin-logistic existe
        const adminLogistic = await adminLogisticSchema.findById(adminLogisticId);
        if (!adminLogistic) {
            return res
                .status(404)
                .json({ message: "Admin-logistic no encontrado" });
        }

        // Actualizar email si se proporciona
        if (email) {
            adminLogistic.email = email;

            // Actualizar el email en usersAuth
            const userAuth = await userAuthSchema.findOne({userId: adminLogisticId,});
            if (userAuth) {
                userAuth.email = email;
                await userAuth.save();
            } else {
                // Si no se encuentra el userAuth, puedes agregar una respuesta para manejo de error
                return res
                    .status(400)
                    .json({ message: "No se pudo actualizar el email en usersAuth" });
            }
        }

        // Actualizar username si se proporciona
        if (username) {
            const usernameExists = await adminLogisticSchema.findOne({  username: username });
            if (usernameExists) {
                return res.status(400).json({ message: "El nuevo nombre de usuario ya está en uso." });
            }

            adminLogistic.username = username;

            // Actualizar el username en usersAuth
            const userAuth = await userAuthSchema.findOne({userId: adminLogisticId});
            if(userAuth){
                userAuth.username = username;
                await userAuth.save();
            }
        }

        // Actualizar contraseña si se proporciona
        if (password) {
            const salt = await bcrypt.genSalt(10);
            adminLogistic.password = await bcrypt.hash(password, salt);
        }

        // Guardar los cambios en adminLogistic
        const updatedAdminLogistic = await adminLogistic.save();

        res.status(200).json({
            message: "Admin-logistic actualizado exitosamente",
            user: updatedAdminLogistic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al actualizar el admin-logistic",
            error: error.message || error,
        });
    }
    }
);

/* ENDPOINTS DE ADIMINSTRADOR */
//Delete de usuarios (el administrador puede eliminar a cualquier usuario)
router.delete("/deleteUsers", auth("admin"), async (req, res) => {
    try {
        const { username } = req.body;

        // Buscar el usuario por username en la tabla usersAuth
        const userAuth = await userAuthSchema.findOne({ username: username });
        if (!userAuth) {
            return res
                .status(404)
                .json({ message: "Usuario no encontrado en usersAuth" });
        }

        // Buscar en la colección de users
        let user = await userSchema.findById(userAuth.userId);

        // Si no se encuentra en la colección de users, buscar en adminLogistic
        if (!user) {
            user = await adminLogisticSchema.findById(userAuth.userId);
        }

        // Si el usuario no se encuentra en ninguna de las colecciones
        if (!user) {
            return res
                .status(404)
                .json({ message: "Usuario no encontrado en ninguna colección" });
        }

        // Eliminar al usuario de la colección correspondiente
        if (user instanceof userSchema) {
            await userSchema.findByIdAndDelete(userAuth.userId);
        } else {
            await adminLogisticSchema.findByIdAndDelete(userAuth.userId);
        }

        // Eliminar también en la colección usersAuth
        await userAuthSchema.findByIdAndDelete(userAuth._id);

        res.status(200).json({
            message: `Usuario ${username} eliminado exitosamente por el admin ${req.user.username}`,
            user: user || adminLogistic,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el usuario",
            error: error.message || error,
        });
    }
});

router.post("/registerUsersAdmin", auth("admin"), async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        //Verificar si el usuario ya existe
        const verifyUser = await userSchema.findOne({ email });
        if (verifyUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //Si el rol del usuario es "user" se le debe crear un carrito y una wishlist
        if (role === "user") {
            const newCart = new cartSchema({
                products: [],
                quantity: 0,
                price: 0,
            });

            const savedCart = await newCart.save();

            const newWishlist = new wishlistSchema({
                wishProducts: [],
            });

            const savedWishlist = await newWishlist.save();

            //Crear el usuario en la colección "users"
            const newUser = new userSchema({
                username: username,
                email: email,
                password: hashPassword,
                role: role,
                image: "",
                cart: savedCart._id,
                paymentMethods: [],
                wishlist: savedWishlist._id,
                orderHistory: [],
            });

            const savedUser = await newUser.save();

            //Agregar el usuario a "usersAuth"
            const newUserAuth = new userAuthSchema({
                username: username,
                email: email,
                userId: savedUser._id.toString(),
            });

            await newUserAuth.save();

            res.status(201).json({
                message: `Usuario admin-logistic registrado por el admin ${req.user.username}`,
                user: savedUser,
            });
        } else {
            //Entonces el rol es "admin" o "logistic"
            //Crear el usuario en la colección "adminLogistic"

            const newAdminLogistic = new adminLogisticSchema({
                username: username,
                email: email,
                password: hashPassword,
                role: role,
                notifications: [],
            });

            const savedAdminLogistic = await newAdminLogistic.save();

            //Agregar el usuario a "usersAuth"
            const newUserAuth = new userAuthSchema({
                username: username,
                email: email,
                userId: savedAdminLogistic._id.toString(),
            });

            await newUserAuth.save();

            res.status(200).json({
                message: `Usuario admin-logistic registrado por el admin ${req.user.username}`,
                user: savedAdminLogistic,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
});

//Update de usuarios (el administrador puede actualizar a cualquier usuario)
router.put("/updateUsersAdmin", auth("admin"), async (req, res) => {
    try {
        const { username, newUsername, email, password, image } = req.body;

        // Buscar el usuario por username en user
        let user = await userSchema.findOne({ username: username });

        if (user) {
            // El usuario está en "user"
            if (newUsername) {
                // Verificar si el nuevo username ya está en uso
                const usernameExists = await userSchema.findOne({
                    username: newUsername,
                });
                if (usernameExists) {
                    return res
                        .status(400)
                        .json({ message: "El nuevo nombre de usuario ya está en uso." });
                }
                // Actualizar el username en la colección "user"
                user.username = newUsername;

                // También actualizar el username en "usersAuth"
                const userAuth = await userAuthSchema.findOne({ userId: user._id });
                if (userAuth) {
                    userAuth.username = newUsername;
                    await userAuth.save();
                }
            }

            if (email) {
                // Verificar si el email ya está en uso
                const emailExists = await userSchema.findOne({ email: email });
                if (emailExists) {
                    return res
                        .status(400)
                        .json({ message: "El correo electrónico ya está en uso." });
                }
                user.email = email;

                // Actualizar el email en usersAuth
                const userAuth = await userAuthSchema.findOne({ userId: user._id });
                if (userAuth) {
                    userAuth.email = email;
                    await userAuth.save();
                }
            }

            // Actualizar la contraseña si se proporciona y se encripta
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            }

            // Actualizar la imagen si se proporciona (solo para "user")
            if (image) {
                user.image = image;
            }

            // Guardar los cambios
            await user.save();
            return res.status(200).json({
                message: `Usuario ${username} actualizado exitosamente por el admin ${req.user.username}`,
                user: user,
            });
        } else {
            // Buscar el usuario por username en adminLogistic
            user = await adminLogisticSchema.findOne({ username: username });

            if (user) {
                // El usuario está en "adminLogistic"
                if (newUsername) {
                    // Verificar si el nuevo username ya está en uso
                    const usernameExists = await adminLogisticSchema.findOne({
                        username: newUsername,
                    });
                    if (usernameExists) {
                        return res
                            .status(400)
                            .json({ message: "El nuevo nombre de usuario ya está en uso." });
                    }
                    // Actualizar el username en la colección "adminLogistic"
                    user.username = newUsername;

                    // También actualizar el username en "usersAuth"
                    const userAuth = await userAuthSchema.findOne({ userId: user._id });
                    if (userAuth) {
                        userAuth.username = newUsername;
                        await userAuth.save();
                    }
                }

                if (email) {
                    // Verificar si el email ya está en uso
                    const emailExists = await adminLogisticSchema.findOne({
                        email: email,
                    });
                    if (emailExists) {
                        return res
                            .status(400)
                            .json({ message: "El correo electrónico ya está en uso." });
                    }
                    user.email = email;

                    // Actualizar el email en usersAuth
                    const userAuth = await userAuthSchema.findOne({ userId: user._id });
                    if (userAuth) {
                        userAuth.email = email;
                        await userAuth.save();
                    }
                }

                // Actualizar la contraseña si se proporciona y se encripta
                if (password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(password, salt);
                }

                // Guardar los cambios
                await user.save();
                return res.status(200).json({
                    message: `Usuario ${username} actualizado exitosamente por el admin ${req.user.username}`,
                    user: user,
                });
            } else {
                return res.status(500).json({ message: "Usuario no encontrado" });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message,
        });
    }
});

//??? Get all orders o get orders by user ???

//Cambiar estado de las ordenes realizadas


module.exports = router;

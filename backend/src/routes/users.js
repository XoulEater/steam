const express = require("express");
const bcrytp = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userSchema = require("../models/user");
const userAuthSchema = require("../models/usersAuth");
const cartSchema = require("../models/cart");
const wishlistSchema = require("../models/wishlist");


dotenv.config();

const router = express.Router();

router.post("/registerUser", async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        //Verificar si el usuario ya existe
        const verifyUser = await userSchema.findOne({email: email});
        if(verifyUser){
            return res.status(400).json({message: "El usuario ya existe"});
        }

        //Encriptar la contraseña
        const salt = await bcrytp.genSalt(10);
        const hashPassword = await bcrytp.hash(password, salt);

        //Crear un carrito para el usuario
        const newCart = new cartSchema({
            products: [],
            quantity: 0,
            price: 0,
        });


        const savedCart = await newCart.save();

        //Crear wishlist al usuario
        const newWishlist = new wishlistSchema({
            wishProducts: [],
        });

        const savedWishlist = await newWishlist.save();

        //Crear un nuevo usuario
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

        //Agregar el usuario a usersAuth
        const newUserAuth = new userAuthSchema({
            username: username,
            userId: savedUser._id,
        });

        await newUserAuth.save();

        res.status(201).json
        ({
            message: "Usuario registrado",
            user: savedUser,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el usuario",
            error: error,
        });
    }
})


module.exports = router;
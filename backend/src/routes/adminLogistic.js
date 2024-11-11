const express = require('express');
const bcrytp = require("bcrypt");
const adminLogisticSchema = require('../models/adminLogistic');
const userAuthSchema = require('../models/usersAuth');
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post("/registerAdminLogistic", async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        //Verificar si el usuario ya existe
        const verifyAdmin = await adminLogisticSchema.findOne({email: email});
        if(verifyAdmin){
            return res.status(400).json({message: "El usuario ya existe"});
        }

        //Encriptar la contraseña
        const salt = await bcrytp.genSalt(10);
        const hashPassword = await bcrytp.hash(password, salt);

        //Crear un nuevo usuario
        const newAdminLogistic = new adminLogisticSchema({
            username: username,
            email: email,
            password: hashPassword,
            role: role,
            notifications: [],
        });

        //Guardar el usuario en la base de datos
        const savedAdmin = await newAdminLogistic.save();

        //Agregar el usuairo a usersAuth
        const newUserAuth = new userAuthSchema({
            email: email,
            userId: savedAdmin._id,
        });

        await newUserAuth.save();

        res.status(201).json({
            message: "Usuario admin-logistic creado exitosamente",
            user: savedAdmin
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el admin-logistic",
            error: error
        })
    }
});

module.exports = router;

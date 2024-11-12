const express = require('express');
const bcrytp = require("bcryptjs");
const adminLogisticSchema = require('../models/adminLogistic');
const userAuthSchema = require('../models/usersAuth');
const auth = require("../middleware/authMiddleware");
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

// Edit admin/logistic user
router.put("/editAdminLogistic", auth(["admin", "logistic"]), async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const adminLogisticId = req.user.id;

        // Verificar si el usuario admin-logistic existe
        const adminLogistic = await adminLogisticSchema.findById(adminLogisticId);
        if (!adminLogistic) {
            return res.status(404).json({ message: "Admin-logistic no encontrado" });
        }

        // Actualizar email si se proporciona
        if (email) {
            adminLogistic.email = email;

            // Actualizar el email en usersAuth
            const userAuth = await userAuthSchema.findOne({ userId: adminLogisticId });
            if (userAuth) {
                userAuth.email = email;
                await userAuth.save();
            } else {
                // Si no se encuentra el userAuth, puedes agregar una respuesta para manejo de error
                return res.status(400).json({ message: "No se pudo actualizar el email en usersAuth" });
            }
        }

        // Actualizar username si se proporciona
        if (username) {
            adminLogistic.username = username;
        }

        // Actualizar contraseña si se proporciona
        if (password) {
            const salt = await bcrytp.genSalt(10);
            adminLogistic.password = await bcrytp.hash(password, salt);
        }

        // Guardar los cambios en adminLogistic
        const updatedAdminLogistic = await adminLogistic.save();

        res.status(200).json({
            message: "Admin-logistic actualizado exitosamente",
            user: updatedAdminLogistic
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            message: "Error al actualizar el admin-logistic",
            error: error.message || error
        });
    }
});


module.exports = router;

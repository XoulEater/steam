const express = require("express");
const auth = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
const Product = require("../models/products");
const Inventory = require("../models/inventory");

dotenv.config();

const router = express.Router();

router.post("/addProducts", async (req, res) => {
    try {
        const {
            name,
            images,
            description,
            categories,
            brand,
            price,
            rating,
            reviews,
            popularity,
            keywords,
            specs,
            discount,
            stock,
        } = req.body;

        const newProduct = new Product({
            name,
            images,
            description,
            categories,
            brand,
            price,
            rating,
            reviews,
            popularity,
            keywords,
            specs,
            discount,
        });

        const savedProduct = await newProduct.save();
        
        // Crear y guardar el inventario para el producto recién creado
        const newInventory = new Inventory({
            product: savedProduct._id,
            quantity: stock, // Usamos el valor de stock como la cantidad en inventario
        });

        const savedInventory = await newInventory.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al agregar prodducto", error: error.message || error });
    }
});

module.exports = router;
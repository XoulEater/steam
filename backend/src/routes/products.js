const express = require("express");
const auth = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
const Product = require("../models/products");
const Inventory = require("../models/inventory");

dotenv.config();

const router = express.Router();

// Agregar Productos como administrador
router.post("/addProduct", auth("admin"), async (req, res) => {
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

// Endpoint para editar un producto
router.put("/editProduct/:id", auth("admin"), async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        // Buscar y actualizar el producto
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        // Si el producto no existe
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Responder con el producto actualizado
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message || error });
    }
});

// Endpoint obtener Id del producto por nombre
/* Duda con respecto a esto, se debe hacer el campo name del esquema product unico
para que no hayan nombres duplicados y esto de error */
router.get("/getIdByName", async (req, res) => {
    try {
        const productName = req.query.name;

        if (!productName) {
            return res.status(400).json({ message: "El nombre del producto es requerido" });
        }

        const product = await Product.findOne({ name: new RegExp(`^${productName}$`) });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ id: product._id });
    } catch (error) {
        res.status(500).json({ message: "Error al buscar el producto", error: error.message || error });
    }
});

module.exports = router;
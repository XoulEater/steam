const express = require("express");
const auth = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
const Product = require("../models/products");
const Inventory = require("../models/inventory");
const Category = require("../models/category");

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


/* ENDPOINTS DE BUSQUEDA Y FILTROS*/

// Obtener todos los productos
router.get("/getProducts", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message || error });
    }
});

//Busqueda de productos con sugerencia
router.get("/searchProducts", async (req, res) => {
    try {
        const { query } = req.query;

        // Crear una expresión regular para la búsqueda en los campos de texto
        const regex = new RegExp(query, "i"); 

        // Crear el filtro de búsqueda
        const filter = {
            $or: [
                { name: regex },
                { brand: regex },
                { rating: isNaN(query) ? undefined : Number(query) } // Solo busca en rating si es un número
            ].filter(Boolean) // Filtrar para omitir campos no aplicables
        };

        // Buscar los productos
        const products = await Product.find(filter);

        res.status(200).json({
            message: "Productos encontrados",
            products: products,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al buscar productos",
            error: error.message,
        });
    }
});

//Obtener todos los desarrolladores (brand) de los productos
router.get("/getBrands", async (req, res) => {
    try {
        const brands = await Product.find().distinct("brand");

        res.status(200).json({
            message: "Marcas encontradas",
            brands: brands,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener marcas",
            error: error.message,
        });
    }
});

//Obtener todas las categorías padre de los productos
router.get("/getCategories", async (req, res) => {
    try {
        const categories = await Category
            .find({ parentCategory: null }) 
            .distinct("name"); 

        res.status(200).json({
            message: "Categorías encontradas",
            categories: categories,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener categorías ",
            error: error.message,
        });
    }
});

//Busqueda por filtros (categoria, brand, rating)
router.get("/searchByFilter", async (req, res) => {
    try {
        const { category, brand, rating } = req.query;  // Recibir los filtros desde el query

        // Inicializamos el objeto para los filtros
        let filterConditions = {};

        // Filtrar por categoría (si se proporciona)
        if (category) {
            // Aseguramos que el filtro de categoría sea exacto a las categorías que contienen el parentCategory
            filterConditions["categories"] = {
                $in: await getCategoriesWithParent(category) 
            };
        }

        // Filtrar por marca (si se proporciona)
        if (brand) {
            filterConditions["brand"] = new RegExp(brand, "i");  
        }

        // Filtrar por rating (si se proporciona)
        if (rating) {
            filterConditions["rating"] = { $eq: Number(rating) };  
        }

        // Buscar productos con todas las condiciones de filtro
        const filteredProducts = await Product.find(filterConditions);

        res.status(200).json({
            message: "Productos encontrados",
            products: filteredProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al buscar productos", error });
    }
});

// Función que obtiene las categorías con un parentCategory específico o con el nombre directamente
async function getCategoriesWithParent(category) {
    // Buscar las categorías que tengan el parentCategory igual al valor de 'category'
    const categories = await Category.find({
        $or: [
            { parentCategory: { $regex: new RegExp(category, "i") } },  
            { name: { $regex: new RegExp(category, "i") } }  
        ]
    });

    return categories.map(cat => cat._id);  
}



module.exports = router;
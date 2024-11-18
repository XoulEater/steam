const express = require("express");
const mongoose = require('mongoose');
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
            categoriesPath,
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
            categoriesPath,
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
        // TODO: Por que como clase aparte y no como un campo de Product?
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

// Editar un producto por su id
router.put("/editProduct/:id", auth("admin"), async (req, res) => {
    try {
        // TODO: No se puede actualizar el stock de un producto
        const productId = req.params.id;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        // Si el producto no existe
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto", error: error.message || error });
    }
});

// Endpoint obtener Id del producto por nombre
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

// Eliminar producto por id
router.delete("/deleteProduct/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        // TODO: No se elimina el inventario del producto

        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrtado" });
        }

        res.status(200).json({ message: "Producto eliminado correctamente", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message });
    }
});

/* ENDPOINTS DE BUSQUEDA Y FILTROS*/

// Obtener todos los productos
router.get("/getProducts", async (req, res) => {
    // TODO: Agregar paginación
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message || error });
    }
});

//Busqueda de productos con sugerencia (busca por nombre, brand o rating)
router.get("/searchProducts", async (req, res) => {
    try {
        const { query } = req.query;

        // Crear una expresión regular para la búsqueda en los campos de texto
        const regex = new RegExp(query, "i");

        // Crear el filtro de búsqueda
        // TODO: Agregar paginación
        // TODO: Para que buscar en rating?
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
        // TODO: Falta por precio 
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

// Filtrar categorias y sub categorias, este endpoint recibe una categoria padre,
// sub categoria (campo path en la base de datos por ejemplo action o shooter) o un nombre
// (campo name en la base de datos por ejemplo Action-RPG, Shooter, RPG)
// http://localhost:3000/products/filterCategoryIndex?query=action
router.get('/filterCategoryIndex', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        const results = await Category.aggregate([
            {
                $search: {
                    index: 'subCategoriesIndex',
                    text: {
                        query: query,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }
        ]);

        res.status(200).send(results);
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).send({ error: 'An error occurred while executing the search' });
    }
});

// Busqueda de Productos por Categoría (`categoriesPath`)
// http://localhost:3000/products/filterProductsByCategory?query=co-op
router.get('/filterProductsByCategory', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        // Realizar la búsqueda utilizando MongoDB Atlas Search con `$search` en el campo `categoriesPath`
        const results = await Product.aggregate([
            {
                $search: {
                    index: 'filterGamesByCategoryIndex',
                    text: {
                        query: query,
                        path: 'categoriesPath',
                        fuzzy: {
                            maxEdits: 1
                        },
                    },
                },
            },
        ]);

        res.status(200).send(results);
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).send({ error: 'An error occurred while executing the search' });
    }
});

// Busqueda de Productos por keywords (`keywords`)
// http://localhost:3000/products/searchKeyWord?query=war
router.get('/searchKeyWord', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        // Realizar la búsqueda utilizando MongoDB Atlas Search con `$search` en el campo `keywords`
        const results = await Product.aggregate([
            {
                $search: {
                    index: 'filterGamesByCategoryIndex',
                    text: {
                        query: query,
                        path: 'keywords',
                        fuzzy: {
                            maxEdits: 1
                        },
                    },
                },
            },
        ]);

        res.status(200).send(results);
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).send({ error: 'An error occurred while executing the search' });
    }
});

// Buscar los 'n' productos mas populares
// http://localhost:3000/products/searchByPopularity?limit=10
router.get('/searchByPopularity', async (req, res) => {
    const { limit } = req.query;
    
    if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).send({ error: 'Se requiere el parametro limite, este debe ser positivo'});
    }

    const n = parseInt(limit);

    try {
        const mostPopularProducts = await Product.find()
            .sort({ popularity: -1 }) // ordenar documentos de manera descendente por popularity
            .limit(n); // Limitar los resultados a 'n'
        
        res.status(200).send(mostPopularProducts);
    } catch (error) {
        console.error("Error obteniendo los productos mas populares:", error);
        res.status(500).send({ error: 'Error obteniendo los productos mas populares' });
    }
});

// TODO: Agregar endpoint para obtener productos con descuento
// TODO: Agregar endpoint para añadir reseñas a productos, debe actualizar el rating del producto

module.exports = router;
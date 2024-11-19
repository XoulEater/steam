const express = require("express");
const mongoose = require('mongoose');
const auth = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
const Product = require("../models/products");
const Category = require("../models/category");
const Discount = require("../models/discount");
const User = require('../models/user');
const ProductReview = require('../models/productReview');

dotenv.config();

const router = express.Router();

// Agregar Productos como administrador
router.post("/addProduct", async (req, res) => {
    try {
        const {
            name,
            images,
            description,
            categoriesPath, // formato: categoria || categoria/sub-categoria || categoria/sub-categoria/sub-categoria ...
            brand,
            price,
            rating,
            reviews,
            popularity,
            keywords,
            specs,
            discount,
            stock,
            sales,
        } = req.body;

        if (!categoriesPath || !Array.isArray(categoriesPath) || categoriesPath.length === 0) {
            return res.status(400).json({ message: "categoriesPath es requerido y debe ser un array no vacío." });
        }

        // Buscar los IDs de las categorías en base a cada elemento de categoriesPath
        const categories = [];
        for (const path of categoriesPath) {
            const category = await Category.aggregate([
                {
                    $search: {
                        index: "subCategoriesIndex", // Usar el índice creado
                        text: {
                            query: path,
                            path: "path", // Campo que almacena el path completo en la colección de categorías
                            fuzzy: { maxEdits: 1 },
                        },
                    },
                },
                { $limit: 1 }, // Tomar solo el primer resultado más relevante
                { $project: { _id: 1 } }, // Solo necesitamos el _id
            ]);

            if (category.length === 0) {
                return res.status(404).json({ message: `No se encontró una categoría para el path: ${path}` });
            }

            categories.push(category[0]._id);
        }

        // Crear el nuevo producto con los IDs de categorías asignados
        const newProduct = new Product({
            name,
            images,
            description,
            categories, // IDs de las categorías
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
            sales,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al agregar producto", error: error.message || error });
    }
});

// Editar un producto por su id. Se le debe pasar un JSON con los campos a modificar
router.put("/editProduct/:id", auth('admin'), async (req, res) => {
    try {
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
router.delete("/deleteProduct/:id", auth('admin'), async (req, res) => {
    try {
        const productId = req.params.id;

        const deletedProduct = await Product.findByIdAndDelete(productId);

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
    try {
        // TODO: Agregar paginacion
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message || error });
    }
});

//Busqueda de productos con sugerencia (busca por nombre, brand o rating)
router.get("/searchProducts", async (req, res) => {
    try {
        // TODO: Agregar paginacion
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
        // TODO: Filtrar por precio
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
        return res.status(400).json({ error: 'Query parameter is required' });
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

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).json({ success: false, error: 'An error occurred while executing the search' });
    }
});

// Busqueda de Productos por Categoría (`categoriesPath`)
// http://localhost:3000/products/filterProductsByCategory?query=co-op
router.get('/filterProductsByCategory', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
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

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).json({ success: false, error: 'An error occurred while executing the search' });
    }
});

// Busqueda de Productos por keywords (`keywords`)
// http://localhost:3000/products/searchKeyWord?query=war
router.get('/searchKeyWord', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
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

        if (!results || results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: `No se encontraron productos con la palabra clave: "${query}"` 
            });
        }

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error executing search:", error);
        res.status(500).json({ error: 'An error occurred while executing the search' });
    }
});

// Buscar los 'n' productos mas populares
// http://localhost:3000/products/searchByPopularity?limit=10
router.get('/searchByPopularity', async (req, res) => {
    const { limit } = req.query;

    if (!limit || isNaN(limit) || parseInt(limit) <= 0) {
        return res.status(400).json({ error: 'Se requiere el parametro limite, este debe ser positivo' });
    }

    const n = parseInt(limit);

    try {
        const mostPopularProducts = await Product.find()
            .sort({ popularity: -1 }) // ordenar documentos de manera descendente por popularity
            .limit(n); // Limitar los resultados a 'n'

        res.status(200).json({ success: true, data: mostPopularProducts });
    } catch (error) {
        console.error("Error obteniendo los productos mas populares:", error);
        res.status(500).json({ error: 'Error obteniendo los productos mas populares' });
    }
});

// Aplica descuento a un solo producto
router.put('/applyDiscountProduct', auth('admin'), async (req, res) => {
    const {
        productName,
        type,
        value,
        validDate,
    } = req.body;

    if (!validDate || !value || !type || !productName) {
        return res.status(400).json({
            error: 'Se requiere el nombre del producto, la fecha, el descuento y el tipo de descuento',
        });
    }

    try {
        const newDiscount = new Discount({
            type,
            value,
            validDate,
        });

        const savedDiscount = await newDiscount.save();

        const product = await Product.findOne({ name: productName });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        product.discount = savedDiscount._id;

        const updatedProduct = await product.save();

        res.status(200).json({
            message: 'Descuento aplicado exitosamente al producto',
            product: updatedProduct,
            discount: savedDiscount,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al aplicar el descuento al producto',
            error: error.message || error,
        });
    }
});

// Aplica descuento a todos los elementos de una categoria o sub categoria
router.put('/applyDiscountCategory', auth('admin'), async (req, res) => {
    const {
        category,
        type,
        value,
        validDate,
    } = req.body;

    if (!validDate || !value || !type || !category) {
        return res.status(400).json({
            error: 'Se requiere la categoria, la fecha, el descuento y el tipo de descuento',
        });
    }

    try {
        const newDiscount = new Discount({
            type,
            value,
            validDate,
        });

        const savedDiscount = await newDiscount.save();

        const productsToUpdate = await Product.aggregate([
            {
                $search: {
                    index: 'filterGamesByCategoryIndex',
                    text: {
                        query: category,
                        path: 'categoriesPath',
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                },
            },
        ]);

        if (productsToUpdate.length === 0) {
            return res.status(400).json({ message: 'No se encontraron productos de la categoria especificada' });
        }

        const updateResults = await Product.updateMany(
            { _id: { $in: productsToUpdate.map((product) => product._id) } },
            { $set: { discount: savedDiscount._id } }
        );

        res.status(200).json({
            message: 'Descuento aplicado exitosamente a los productos de la categoría',
            discount: savedDiscount,
            updatedProducts: updateResults.modifiedCount, // Cantidad de productos actualizados
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al aplicar el descuento a la categoría',
            error: error.message || error,
        });
    }
});

// TODO: Este metodo puede optimizarse con indice en base de datos
// Obtiene todos los productos con descuento
router.get('/discountedProducts', async (req, res) => {
    try {
        const discountedProducts = await Product.find({ discount: { $ne: null } }).populate('discount');

        res.status(200).json({ success: true, data: discountedProducts });
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos con descuento',
            error: error.message || error,
        });
    }
});

// TODO: Este endpoint crea el review con el rating esppecificado, sin embargo
// TODO: no actualiza el rating deL producto en si, supongo que se promedia con el resto?
// Agregar review de un producto
router.post('/addReview', async (req, res) => {
    const { userName, productName, review, rating } = req.body;

    if (!userName || !productName || !review || !rating) {
        return res.status(400).json({
            error: 'Se requiere todos los datos: userName, productName, review, rating'
        });
    }

    if (typeof userName !== 'string' || typeof productName !== 'string' || typeof review !== 'string') {
        return res.status(400).json({
            error: 'Datos userName, productName y review deben ser de tipo string'
        });
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Dato rating debe ser de tipo Number' });
    }

    try {
        const user = await User.findOne({ username: userName }, { _id: 1 });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const product = await Product.findOne({ name: productName }, { _id: 1 });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        const newProductReview = new ProductReview({
            userId: user._id,
            productId: product._id,
            review,
            rating,
        });

        const productReviewSaved = await newProductReview.save();

        await Product.updateOne(
            { _id: product._id },
            { $push: { reviews: productReviewSaved._id } }
        );

        res.status(201).json({
            success: true,
            message: 'Rating añadido exitosamente',
            productReview: productReviewSaved,
        });
    } catch (error) {
        console.error('Error al agregar el rating:', error);
        res.status(500).json({
            error: 'Error al agregar product review',
            details: error.message,
        });
    }
});

module.exports = router;
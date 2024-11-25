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
router.post("/addProduct", auth("admin"), async (req, res) => {
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
        // Consulta los productos y rellena los campos referenciados
        const products = await Product.find()
            .populate("categories")  
            .populate("reviews")     
            .populate("discount");   

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message || error });
    }
});


//Busqueda de productos con sugerencia (busca por nombre, brand o rating)
// Búsqueda de productos con sugerencia (busca por nombre, brand o rating)
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

        // Buscar los productos con populate
        const products = await Product.find(filter)
            .populate("categories", "name path") // Poblar categorías con los campos necesarios
            .populate({
                path: "reviews",
                select: "review rating",
                populate: {
                    path: "userId",
                    select: "username"
                }
            }) 
            .populate("discount", "type value validDate"); // Poblar descuento con los campos necesarios

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
        const { category, brand, rating } = req.query; // Recibir los filtros desde el query

        // Inicializamos el objeto para los filtros
        let filterConditions = {};

        // Filtrar por categoría (si se proporciona)
        if (category) {
            // Aseguramos que el filtro de categoría incluya subcategorías relacionadas
            filterConditions["categories"] = {
                $in: await getCategoriesWithParent(category)
            };
        }

        // Filtrar por marca (si se proporciona)
        if (brand) {
            filterConditions["brand"] = new RegExp(brand, "i"); // Búsqueda insensible a mayúsculas
        }

        // Filtrar por rating (si se proporciona)
        if (rating) {
            filterConditions["rating"] = { $eq: Number(rating) };
        }

        // Buscar productos con todas las condiciones de filtro y poblar referencias
        const filteredProducts = await Product.find(filterConditions)
            .populate("categories", "name") 
            .populate({
                path: "reviews",
                select: "review rating",
                populate: {
                    path: "userId",
                    select: "username" 
                }
            })
            .populate("discount", "type value validDate"); 

        res.status(200).json({
            message: "Productos encontrados",
            products: filteredProducts,
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
        // Filtrar productos con descuento no nulo
        const discountedProducts = await Product.find({ discount: { $ne: null } })
            .populate("categories", "name") 
            .populate({
                path: "reviews",
                select: "review rating",
                populate: {
                    path: "userId",
                    select: "username" 
                }
            })
            .populate("discount", "type value validDate"); 

        res.status(200).json({
            success: true,
            data: discountedProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los productos con descuento",
            error: error.message || error,
        });
    }
});

// TODO: Este endpoint crea el review con el rating especificado, sin embargo
// TODO: no actualiza el rating deL producto en si, supongo que se promedia con el resto?
// Agregar review de un producto
router.post('/addReview', auth("user"), async (req, res) => {
    try {
        const { productId, review, rating } = req.body;
        const userId = req.user.id;

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        //Verificar si el rating es valido (entre 0 y 5)
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "El rating debe estar entre 0 y 5" });
        }

        // Crear la nueva review
        const newReview = new ProductReview({
            userId,
            productId,
            review,
            rating,
        });

        // Guardar la review en la colección de productReviews
        await newReview.save();

        // Agregar la review al producto
        product.reviews.push(newReview._id);
        await product.save();

        //Calcular el nuevo rating del producto
        const allRatings = await ProductReview.find({ productId });
        const averageRating = allRatings.reduce((acc, review) => acc + review.rating, 0) / allRatings.length;

        // Actualizar el rating del producto
        product.rating = averageRating;
        await product.save();

        res.status(201).json({
            message: "Reseña agregada correctamente",
            productId: productId,
            review: newReview,
        });
    
    } catch (error) {
        console.error('Error al agregar el rating:', error);
        res.status(500).json({
            error: 'Error al agregar product review',
            details: error.message,
        });
    }
});

// Obtener reviews de un producto, (se le tiene que pasar el id del producto en un body)
router.get("/getReviewsByProduct", async (req, res) => {
    try {
        const { productId } = req.body; 

        // Verificar si el producto existe y poblar las reseñas
        const product = await Product.findById(productId)
            .populate({
                path: "reviews",
                populate: [
                    {
                        path: "userId",
                        select: "username -_id", 
                    },
                    {
                        path: "productId",
                        select: "name _id", 
                    }
                ]
            });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Retornar las reseñas con la información completa
        res.status(200).json({
            message: "Reseñas encontradas",
            reviews: product.reviews
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener reviews",
            error: error.message || error,
        });
    }
});

module.exports = router;
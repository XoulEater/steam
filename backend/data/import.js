const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Importar los modelos necesarios
const Product = require('../src/models/products');
const ProductReview = require('../src/models/productReview');
const User = require('../src/models/user');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Conectado a MongoDB");
        seedReviews(); // Llamar a la función para cargar reseñas
    })
    .catch((error) => {
        console.error("Error de conexión a MongoDB", error);
    });

// Función para cargar las reseñas
async function seedReviews() {
    try {
        // Leer el archivo JSON de productos y reseñas
        const data = fs.readFileSync('/Users/franvq09/Documents/TEC/Semestre8/DesarrolloWeb/Proyecto/steam/backend/data/reviews.json', 'utf-8');
        const productsWithReviews = JSON.parse(data);  // Aquí es donde tus productos y reseñas se encuentran.

        for (const productData of productsWithReviews) {
            // Buscar el producto por nombre (title)
            const product = await Product.findOne({ name: productData.title });
            if (!product) {
                console.log(`Producto no encontrado: ${productData.title}`);
                continue;  // Si no se encuentra el producto, pasar al siguiente
            }

            // Array para almacenar las reseñas que vamos a crear
            const reviewIds = [];

            // Procesar las reseñas para este producto
            for (const review of productData.reviews) {
                // Buscar el usuario por el nombre del autor
                const user = await User.findOne({ username: review.author });
                if (!user) {
                    console.log(`Usuario no encontrado: ${review.author}`);
                    continue;  // Si no se encuentra el usuario, pasar a la siguiente reseña
                }

                // Crear la reseña (ProductReview)
                const newReview = new ProductReview({
                    userId: user._id,
                    productId: product._id,
                    review: review.comment,
                    rating: review.rating,
                });

                // Guardar la reseña en la base de datos
                const savedReview = await newReview.save();
                reviewIds.push(savedReview._id);  // Agregar la referencia de la reseña al array

                console.log(`Reseña agregada para el producto: ${product.name}`);
            }

            // Actualizar el campo 'reviews' del producto con las reseñas creadas
            product.reviews = reviewIds;
            await product.save();
            console.log(`Producto actualizado con las reseñas: ${product.name}`);
        }

        // Cerrar la conexión
        mongoose.connection.close();
    } catch (error) {
        console.error("Error al agregar reseñas:", error);
        mongoose.connection.close();
    }
}

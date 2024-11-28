const dotenv = require("dotenv");
const Product = require("../models/products");
const Category = require("../models/category");

dotenv.config();

class DashboardController {
    static async getSales(req, res) {
        try {
            // Obtener los parámetros de la consulta para la paginación
            const { page, limit } = req.query;
            
            // Establecer valores predeterminados si no se pasan parámetros
            const pageNumber = page ? parseInt(page) : 1; 
            const pageSize = limit ? parseInt(limit) : 10; 

            // Calcular el salto (skip) para la paginación
            const skip = (pageNumber - 1) * pageSize;

            // Consultar los productos ordenados por ventas con paginación
            const products = await Product.aggregate([
                { $sort: { sales: -1 } },  
                { $skip: skip },           
                { $limit: pageSize }       
            ]);

            // Obtener el número total de productos para calcular las páginas
            const totalProducts = await Product.countDocuments();

            // Calcular el número total de páginas
            const totalPages = Math.ceil(totalProducts / pageSize);

            // Responder con los productos y la información de la paginación
            res.status(200).json({
                message: "Productos obtenidos correctamente",
                products,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalProducts,
                    pageSize
                }
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener los productos",
                error: error.message || error
            });
        }
    }
}

module.exports = DashboardController;

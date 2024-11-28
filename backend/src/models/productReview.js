const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Referencia al usuario que escribió la reseña
  review: { type: String, required: true }, // Contenido de la reseña
  rating: { type: Number, min: 0, max: 5, required: true }, // Calificación, entre 0 y 5
}, { timestamps: true });

module.exports = { productReviewSchema };

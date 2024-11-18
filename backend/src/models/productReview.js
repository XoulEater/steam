const mongoose = require("mongoose");

const productReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referencia al usuario que escribió la reseña
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Referencia al producto reseñado
  review: { type: String, required: true }, // Contenido de la reseña
  rating: { type: Number, min: 0, max: 5, required: true }, // Calificación, entre 0 y 5
  date: { type: Date, default: Date.now }, // Fecha de la reseña
}, { timestamps: true });

module.exports = mongoose.model("ProductReview", productReviewSchema);

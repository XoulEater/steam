const mongoose = require("mongoose");
const { productReviewSchema } = require("../models/productReview");
const { discountSchema } = require("../models/discount");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    images: [{ type: String }], // URLs de imágenes del producto
    description: { type: String, required: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ], // Categorías del producto (referencia a otra colección "Category")
    categoriesPath: [{ type: String }],
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating entre 0 y 5
    reviews: [productReviewSchema], // Reseñas del producto
    popularity: { type: Number, default: 0 }, // Popularidad (por ejemplo, cantidad de ventas)
    keywords: [{ type: String }], // Palabras clave para búsqueda
    specs: {
      type: Map,
      of: String,
    },
    discount: discountSchema,
    stock: { type: Number, required: true },
    sales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

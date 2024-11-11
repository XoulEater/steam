const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String }], // URLs de imágenes del producto
    description: { type: String, required: true },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ], // Categorías del producto (referencia a otra colección "Category")
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Rating entre 0 y 5
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductReview" }], // Reseñas del producto
    popularity: { type: Number, default: 0 }, // Popularidad (por ejemplo, cantidad de ventas)
    keywords: [{ type: String }], // Palabras clave para búsqueda
    specs: {
      type: Map,
      of: String,
    }, // Especificaciones técnicas (por ejemplo, recursos mínimos)
    discount: {
      type: Number,
      min: 0,
      max: 100,
    }, // Descuento en porcentaje (0 - 100)
    stock: { type: Number, required: true }, // Cantidad en stock
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

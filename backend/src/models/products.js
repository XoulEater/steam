const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String }], // URLs de imágenes del producto
    description: { type: String, required: true, unique: true }, // TODO: por que unique?
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
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductReview" }], // Reseñas del producto
    popularity: { type: Number, default: 0 }, // Popularidad (por ejemplo, cantidad de ventas)
    keywords: [{ type: String }], // Palabras clave para búsqueda
    // TODO: Los spec son fijos y pueden ser nulos
    // OS, Processor, Memory, Graphics, DirectX, Storage
    specs: {
      type: Map,
      of: String,
    }, // Especificaciones técnicas (por ejemplo, recursos mínimos)
    discount: {
      type: Number,
      min: 0,
      max: 100,
    } // Descuento en porcentaje (0 - 100)
  },
  { timestamps: true }
);

// TODO: revisar si envia ID al front
// TODO: revisar si envia las categorias al front
// TODO: falta release date
// TODO: por que stock y sales esta en otro schema?

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

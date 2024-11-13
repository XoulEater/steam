const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },  
      quantity: { type: Number, required: true, default: 1 },  
      price: { type: Number, required: true },  
    },
  ],
  totalPrice: { type: Number, required: true, default: 0 },  
});

module.exports = mongoose.model("Cart", cartSchema);

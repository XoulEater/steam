const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  products: [{
      type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, default: [],
  }],
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Cart", cartSchema);

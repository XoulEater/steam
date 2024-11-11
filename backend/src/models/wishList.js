const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }],
});

module.exports = mongoose.model("WishList", wishListSchema);
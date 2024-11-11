const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
  wishProducts: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, default: []
  }],
});

module.exports = mongoose.model("WishList", wishListSchema);
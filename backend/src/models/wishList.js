const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
  wishProducts: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, default: []
  }],
});

module.exports = mongoose.models.WishList || mongoose.model("WishList", wishListSchema);
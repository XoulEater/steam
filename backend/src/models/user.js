const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    image: { type: String }, // URL de la imagen opcional
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    paymentMethods: [
      {type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod"},
    ],
    wishlist: {type: mongoose.Schema.Types.ObjectId, ref: "Wishlist"},
    orderHistory: [ {type: mongoose.Schema.Types.ObjectId, ref: "Order"}
    ],
  },{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
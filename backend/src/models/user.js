const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    image: { type: String, default: ""}, // URL de la imagen opcional
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", default: null },
    paymentMethods: [
      {type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", default: []},
    ],
    wishlist: {type: mongoose.Schema.Types.ObjectId, ref: "Wishlist", default: null }, 
    orderHistory: [ {type: mongoose.Schema.Types.ObjectId, ref: "Order", default: []}
    ],
  },{ timestamps: true });

  // TODO: Hubiera sido mas simple tener campos anidados en lugar de referencias

module.exports = mongoose.model("User", userSchema);
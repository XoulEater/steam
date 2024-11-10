const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cardType: { type: String, required: true }, 
  cardNumber: { type: String, required: true }, 
  expirationDate: { type: String, required: true },
  billingAddress: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);

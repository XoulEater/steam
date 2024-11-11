const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cardType: { type: String, required: true }, 
  cardNumber: { type: String, required: true }, 
  expirationDate: { type: String, required: true },
});

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    productAmount: { type: Number, required: true },
    purchasedProducts: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
    }],
    price : { type: Number, required: true },
    idPaymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
    orderStatus: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
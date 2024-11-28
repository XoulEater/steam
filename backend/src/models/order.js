const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    purchasedProducts: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    }],
    price : { type: Number, required: true },
    orderStatus: { type: String, enum: ["pending", "inPreparation", "sent", "delivered"], required: true },
});

module.exports = mongoose.model("Order", orderSchema);
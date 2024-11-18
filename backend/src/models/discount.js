const mongoose = require("mongoose");

// Esquema para los descuentos
const discountSchema = new mongoose.Schema(
    {
        type: { type: String, required: true, enum: ["porcentual", "fijo"], lowercase: true, },
        value: { type: Number, required: true, min: 0, },
        validDate: { type: Date, required: true },
    },
    { timestamps: true, }
);

module.exports = mongoose.model("Discount", discountSchema);
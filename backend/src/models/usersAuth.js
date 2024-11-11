const mongoose = require("mongoose");

const usersAuth = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
});

module.exports = mongoose.model("usersAuth", usersAuth);
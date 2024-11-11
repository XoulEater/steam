const mongoose = require("mongoose");

const usersAuth = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
});

module.exports = mongoose.model("usersAuth", usersAuth);
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user");

const router = express.Router();

//TODO: Hacer el login y el registro de usuarios (Normal user and admin-logistic)
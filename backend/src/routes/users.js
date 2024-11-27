const express = require("express");
const dotenv = require("dotenv");
const userController = require("../controllers/UserController");

dotenv.config();

const router = express.Router();

router.get("/", userController.userCart);
router.post("/registerUser", userController.registerUser);
router.put("/editUser", userController.editUser);
router.delete("/deleteUser", userController.deleteUser);
router.post("/addToCart", userController.addToCart);
router.delete("/deleteFromCart", userController.deleteFromCart);
router.get("/userWishlist", userController.userWishlist);
router.post("/addToWishlist", userController.addToWishlist);
router.delete("/deleteFromWishlist", userController.deleteFromWishlist);
router.post("/addOrder", userController.addOrder);
router.get("/getOrders", userController.getOrders);

module.exports = router;

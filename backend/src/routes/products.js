const express = require("express");
const dotenv = require("dotenv");
const gameController = require("../controllers/GameController");

dotenv.config();

const router = express.Router();

router.get("/", gameController.getProducts);
router.post("/addProduct", gameController.addProduct);
router.put("/editProduct", gameController.editProduct);
router.delete("/deleteProduct/:id", gameController.deleteProduct);
router.get("/searchProduct", gameController.searchProducts);
router.get("/getBrands", gameController.getBrands);
router.get("/getCategories", gameController.getCategories);
router.get("/filterCategoryIndex", gameController.filterCategoryIndex);
router.get("/filterProductsByCategory", gameController.filterProductsByCategory);
router.get("/searchKeyWord", gameController.searchKeyWord);
router.get("/searchByPopularity", gameController.searchByPoplarity);
router.put("/applyDiscountProduct", gameController.applyDiscountProduct);
router.put("/applyDiscountCategory", gameController.applyDiscountCategory);
router.get("/discountedProducts", gameController.discountedProducts);
router.post("/addReview", gameController.addReview);
router.get("/getReviewsByProduct", gameController.getReviewsByProduct);

module.exports = router;
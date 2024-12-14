const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    getProductByCategory,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, adminMiddleware, updateProductById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProductById);
router.get("/category/:category", getProductByCategory);

module.exports = router;

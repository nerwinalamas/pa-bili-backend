const Product = require("../models/Product");

const createProduct = async (req, res) => {
    const { name, description, price, category, stockQuantity, imageUrl } =
        req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stockQuantity,
            imageUrl,
            createdBy: req.user._id,
        });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const updateProductById = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stockQuantity, imageUrl } =
        req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, category, stockQuantity, imageUrl },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const deleteProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getProductByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const products = await Product.find({ category: category });
        if (!products.length) {
            return res
                .status(404)
                .json({ message: "No products found in this category" });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    getProductByCategory
};

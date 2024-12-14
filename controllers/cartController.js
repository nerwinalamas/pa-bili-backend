const Cart = require("../models/Cart");

const addItemToCart = async (req, res) => {
    const { userId, productId, quantity, price } = req.body;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            // Item already exists in the cart
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ productId, quantity, price });
        }

        cart.totalAmount += quantity * price;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const updateItemQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            // Update the quantity of the existing item
            const previousQuantity = cart.items[itemIndex].quantity;
            cart.items[itemIndex].quantity = quantity;

            // Update total amount
            const price = cart.items[itemIndex].price; // Get the price from the existing item
            cart.totalAmount += (quantity - previousQuantity) * price;

            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Item not found in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const itemPrice =
            cart.items[itemIndex].price * cart.items[itemIndex].quantity;
        cart.totalAmount -= itemPrice;

        cart.items.splice(itemIndex, 1);

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const checkout = async (req, res) => {
    const { userId, shippingAddress, paymentMethod } = req.body;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res
                .status(400)
                .json({ message: "Cart is empty or not found" });
        }

        const newOrder = new Order({
            user: userId,
            orderItems: cart.items.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress,
            paymentMethod,
            totalPrice: cart.totalAmount,
        });

        await newOrder.save();

        // Update stock quantity of the products
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stockQuantity: -item.quantity },
            });
        }

        await Cart.findOneAndDelete({ userId });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getCartItemCount = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({ itemCount: 0 });
        }

        const itemCount = cart.items.reduce(
            (total, item) => total + item.quantity,
            0
        );

        res.status(200).json({ itemCount });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

module.exports = {
    addItemToCart,
    updateItemQuantity,
    getUserCart,
    removeFromCart,
    checkout,
    getCartItemCount
};

const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;
        const userId = req.user._id;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                message: "No order items",
            });
        }

        if (
            !shippingAddress ||
            !shippingAddress.street ||
            !shippingAddress.city ||
            !shippingAddress.postalCode ||
            !shippingAddress.country
        ) {
            return res.status(400).json({
                message: "Incomplete shipping address",
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                message: "Payment method is required",
            });
        }

        // Check product availability and calculate total price
        let calculatedTotalPrice = 0;
        const processedOrderItems = await Promise.all(
            orderItems.map(async (item) => {
                console.log("item:", item);
                // Find the product
                const product = await Product.findById(item.productId._id);

                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }

                // Check stock availability
                if (product.stockQuantity < item.quantity) {
                    throw new Error(
                        `Insufficient stock for product: ${product.name}`
                    );
                }

                // Calculate item price
                const itemPrice = product.price * item.quantity;
                calculatedTotalPrice += itemPrice;

                // Update product stock
                product.stockQuantity -= item.quantity;
                await product.save();

                return {
                    product: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price,
                };
            })
        );

        const order = new Order({
            user: userId,
            orderItems: processedOrderItems,
            shippingAddress,
            paymentMethod,
            totalPrice: calculatedTotalPrice,
            orderStatus: "Pending",
        });

        const createdOrder = await order.save();

        await Cart.findOneAndDelete({ userId });

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find({ user: userId });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate({
            path: "orderItems.product",
            select: "name ",
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        if (orders.length === 0) {
            return res.status(404).json({
                message: "No orders found",
            });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus, isPaid, paidAt, isDelivered, deliveredAt } = req.body;

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        // Update order status if provided
        if (orderStatus) {
            order.orderStatus = orderStatus;
        }

        // Update payment status
        if (isPaid !== undefined) {
            order.isPaid = isPaid;
            order.paidAt = isPaid ? paidAt || new Date() : null;
        }

        // Update delivery status
        if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
            order.deliveredAt = isDelivered ? deliveredAt || new Date() : null;
        }

        // Save the updated order
        const updatedOrder = await order.save();

        res.status(200).json({
            message: "Order updated successfully",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};

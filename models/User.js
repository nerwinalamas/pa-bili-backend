const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        shippingAddress: {
            street: { type: String, default: "" },
            city: { type: String, default: "" },
            postalCode: { type: String, default: "" },
            country: { type: String, default: "" },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

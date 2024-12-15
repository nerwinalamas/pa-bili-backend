const mongoose = require("mongoose");

const ContactSubmissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const ContactSubmission = mongoose.model(
    "ContactSubmission",
    ContactSubmissionSchema
);

module.exports = ContactSubmission;

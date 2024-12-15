const nodemailer = require("nodemailer");
const ContactSubmission = require("../models/ContactSubmission");

const sendContactMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            error: "All fields are required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email format",
        });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `${name} <${email}>`,
            to: "nerwinalamas@gmail.com",
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h3>Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        });

        const contactSubmission = new ContactSubmission({
            name,
            email,
            message,
            submittedAt: new Date(),
        });
        await contactSubmission.save();

        res.status(200).json({
            message: "Message sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: "Failed to send message",
        });
    }
};

module.exports = {
    sendContactMessage,
};

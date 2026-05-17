import nodemailer from "nodemailer";

// GMAIL_EMAIL
// GMAIL_APP_PASSWORD
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to,
            subject,
            html
        });
    } catch (error) {
        console.log(error);
    }
}
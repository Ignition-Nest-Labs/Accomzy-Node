const nodemailer = require('nodemailer');

async function sendMail({ Subject, Text }) {
    // Create a transporter using Hostinger's SMTP server
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // Replace with your domain or mail server
        port: 465, // Hostinger typically uses port 587 for SMTP
        secure: true, // Set to true if you're using a secure connection (TLS/SSL)
        auth: {
            user: 'support@ignitionnestlabs.online', // Replace with your email address
            pass: 'Gaurang$5213$' // Replace with your email password or app password
        }
    });

    // Email options
    const mailOptions = {
        from: 'support@ignitionnestlabs.online',
        to: 'nileshpatel5213@gmail.com',
        subject: Subject,
        text: Text
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
}

// Call the function to send the email

module.exports = { sendMail };

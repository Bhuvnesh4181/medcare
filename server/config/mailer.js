const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bhuvneshsharma4181@gmail.com',
        pass: 'zbjtaiihizhgvvbc',
    },
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages.');
    }
});

const sendApprovalEmail = async (userEmail, userName) => {
    const mailOptions = {
        from: 'aditya.pandey@tothenew.com',
        to: userEmail,
        subject: 'Appointment Approved',
        text: `Dear ${userName}, your appointment request has been approved.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", userEmail);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendApprovalEmail;

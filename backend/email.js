const nodemailer = require('nodemailer');
const emailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'anjelin0707@gmail.com',
        pass: 'hyvesiyfbnmfndpk',
    },
});

// transporter.verify().then(console.log).catch(console.error);

module.exports = { emailTransporter }
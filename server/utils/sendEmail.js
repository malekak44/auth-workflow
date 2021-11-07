const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: '"Maleka" <malekak44@gmail.com>',
        to,
        subject,
        html,
    });

    return nodemailer.getTestMessageUrl(info);
}

module.exports = sendEmail;

const nodemailer = require('nodemailer');
//const constantObj = require('../config/env');

const transporter = nodemailer.createTransport(
    {
        host: process.env.HOST,
        secureConnection: false,
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

exports.mailFn = async (mailOptions) => {
    if (mailOptions.to == process.env.EMAIL) {

    } else {
        transporter.sendMail({ ...mailOptions, from: process.env.EMAIL }, function (error, info) {
            if (error) {
                console.log('Error on email', error);
            } else {
                console.log('success on logs=>', info);
            }
        });

    }
};


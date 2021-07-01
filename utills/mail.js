
const nodemailer = require('nodemailer');
//const constantObj = require('../config/env');

const transporter = nodemailer.createTransport(
    {
        host: "smtpout.secureserver.net",
        secureConnection: false,
        port: 587,
        auth: {
            user: 'mail@techfestsliet.com',
            pass: 'Sliet@20201'
        }
    });

exports.mailFn = async (mailOptions) => {
    if (mailOptions.to == 'mail@techfestsliet.com') {

    } else {
        transporter.sendMail({ ...mailOptions, from: 'mail@techfestsliet.com' }, function (error, info) {
            if (error) {
                console.log('Error on email', error);
            } else {
                console.log('success on logs=>', info);
            }
        });

    }
};


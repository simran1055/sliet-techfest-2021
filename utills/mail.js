
const nodemailer = require('nodemailer');
//const constantObj = require('../config/env');

const transporter = nodemailer.createTransport(
    {
        host: "ip-184-168-126-198.ip.secureserver.net",
        secureConnection: false,
        port: 587,
        auth: {
            user: 'mail@techfestsliet.com',
            pass: 'ARB2FKz4qbsUSLX'
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


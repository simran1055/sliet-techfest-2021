
const nodemailer = require('nodemailer');
//const constantObj = require('../config/env');

const transporter = nodemailer.createTransport(
    {
        service: "gmail",
        secureConnection: true,
        // port: 587,
        auth: {
            user: 'beawaredotworld@gmail.com',
            pass: 'beaware@123'
        }
    });

exports.mailFn = async (mailOptions) => {
    if (mailOptions.to == 'beawaredotworld@gmail.com') {

    } else {
        transporter.sendMail({ ...mailOptions, from: 'beawaredotworld@gmail.com' }, function (error, info) {
            if (error) {
                console.log('Error on email', error);
            } else {
                console.log('success on logs=>', info);
            }
        });

    }
};


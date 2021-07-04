
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();



const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOEKN })

exports.mailFn = async (mailOptions) => {
    const accessToken = await oAuth2Client.getAccessToken()
    const transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                type: 'OAuth2',
                user: process.env.G_EMAIL,
                accessToken: accessToken,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOEKN,
            }
        });
    if (mailOptions.to == process.env.G_EMAIL) {

    } else {
        transporter.sendMail({ ...mailOptions, from: process.env.G_EMAIL }, function (error, info) {
            if (error) {
                console.log('Error on email', error);
            } else {
                console.log('success on logs=>', info);
            }
        });

    }
};


// const nodemailer = require('nodemailer');
// //const constantObj = require('../config/env');

// const transporter = nodemailer.createTransport(
//     {
//         host: process.env.HOST,
//         secureConnection: false,
//         port: 587,
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     });

// exports.mailFn = async (mailOptions) => {
//     if (mailOptions.to == process.env.EMAIL) {

//     } else {
//         transporter.sendMail({ ...mailOptions, from: process.env.EMAIL }, function (error, info) {
//             if (error) {
//                 console.log('Error on email', error);
//             } else {
//                 console.log('success on logs=>', info);
//             }
//         });

//     }
// };


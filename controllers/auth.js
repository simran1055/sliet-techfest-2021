const { check, cookie, validationResult } = require("express-validator");
const uuidv4 = require('uuid');

const User = require("../models/user");
const { mailFn } = require("../utills/mail");
const { successAction, failAction } = require("../utills/response")
const message = require("../utills/messages")

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signUp = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    // // if (await User.findOne({ name: req.body.name })) return res.status(400).json(failAction('Name is already registerd'));
    // if (await User.findOne({ email: req.body.email })) {
    //     return res.status(400).json(failAction('Email is already registerd'));
    // }

    let count = await User.countDocuments();
    let emailAr = req.body.email.split("@");
    let use = emailAr[0];
    let domain = emailAr[1];
    let userId = '#TF' + pad(count + 1, 5).toString();
    let payload;
    if (domain == "sliet.ac.in") {
        let collegeName = "Sant Longowal Institute of Engineering and Technology";
        let regNo = use;
        let hasPaidEntry = true;

        payload = {
            ...req.body, ...{
                verificationCode: uuidv4.v4(),
                collegeName,
                userId,
                regNo,
                hasPaidEntry
            }
        }
    } else {

        payload = {
            ...req.body, ...{
                userId,
                verificationCode: uuidv4.v4()
            }
        }
    }

    const user1 = new User(payload);

    user1.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json(
                failAction("Not able to Sign Up. Some error ocuured")
            )
        }

        mailFn({
            to: req.body.email,
            subject: message.verificaton,
            html: `<h1>Thanks for REgistration ${user.name}</h1>
                <p> <a href="https://sliet.movieshunters.com?vf=${user.verificationCode}?id=${user.id}"> Please Click here to verify </a></p>
            `
        })

        res.status(200).json(
            successAction({
                name: user.name,
                email: user.email,
                id: user._id,
                hasPaidEntry: user.hasPaidEntry
            })
        )
    })


}


exports.signIn = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json(
                failAction("Email Id not registered with us.")
            )
        }


        // we can remove this and use middle ware also
        if (!user.isVerified) {
            return res.json(failAction('User is not verified. Please Verify you email.'))
        }

        if (!user.authenticate(password)) {
            return res.status(401).json(
                failAction("Email and password do not match.")
            )
        }


        // create a token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET);

        // put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send response to frontend

        const { _id, email, name, role, isVerified, hasPaidEntry } = user;

        res.json(
            successAction({
                token,
                user: { _id, email, name, role, isVerified, hasPaidEntry }
                // user
            })
        )
    })


}

exports.verify = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const { vf, id } = req.body;
    User.findOne({ _id: id }, (err, user) => {

        if (err) {
            return res.json(failAction('User not found.'))
        }

        if (user.isVerified) {
            return res.json(successAction('User already Verified.'))
        }

        if (user.verificationCode == vf) {
            User.findByIdAndUpdate(
                { _id: id },
                { $set: { isVerified: true } },
                (err, user) => {
                    if (err) {
                        return res.status(400).json(failAction('Verification Failed'))
                    }
                    let { _id, email, name, role } = user;
                    return res.json(successAction({
                        user: { _id, email, name, role, isVerified: true }
                    }))
                }
            )
        }
        else {
            return res.json(failAction('Verification Faild'))
        }

    })
}

exports.signOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        msg: "User signout"
    })
}


//protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.auth._id == req.profile._id;
    console.log(req.auth)
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied , Not authenticated"
        })
    }
    next();
}




// /middle ware for isverified
exports.isVerifiedCheck = (req, res, next) => {
    User.findById(req.auth._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Error while fetching user"
            })
        }

        if (user.isVerified != 1) return res.status(400).json(failAction('Verification Failed'))
        next();
    })

}

/// has paid the fees

exports.hasPaidEntryCheck = (req, res, next) => {
    User.findById(req.auth._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Error while fetching user"
            })
        }

        if (user.hasPaidEntry != 1) return res.status(400).json(failAction('Entry fee not paid'))
        next();
    })


}
/// is profile complete

exports.isProfileCompleteCheck = (req, res, next) => {
    User.findById(req.auth._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Error while fetching user"
            })
        }

        if (user.isProfileComplete != 1) return res.status(400).json(failAction('Profile not complete'))
        next();
    })


}


exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        res.status(403).json({
            error: "You are not admin, ACCESS DENIED"
        })
    }
    next();
}
exports.isSuperAdmin = (req, res, next) => {
    if (req.profile.role == 0 || req.profile.role == 1) {
        res.status(403).json({
            error: "You are not super admin, ACCESS DENIED"
        })
    }
    next();
}


// Pad number 
function pad(number, length) {

    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }

    return str;

}

exports.isAuthenticatedFn = (req, res, next) => {
    console.log(req.auth);
    if (!req.auth) {
        res.status(403).json({
            error: "Access Denied , Not authenticated"
        })
    } else {
        req.user = req.auth;
    }
    next()
}
import { check, cookie, validationResult } from "express-validator";
import { v4 as uuidv4 } from 'uuid';

import User from "../models/user";
import { mailFn } from '../utills/mail';
import { successAction, failAction } from "../utills/response"
import message from '../utills/messages'



var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signUp = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    // if (await User.findOne({ name: req.body.name })) return res.status(400).json(failAction('Name is already registerd'));
    if (await User.findOne({ email: req.body.email })) return res.status(400).json(failAction('Email is already registerd'));
    let payload = { ...req.body, ...{
        verificationCode : uuidv4()
    } }

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
                <p> <a href="https://sliet.movieshunters.com?vc=${user.verificationCode}?id=${user.id}"> Please Click here to verify </a></p>
            `
        })

        res.status(200).json(
            successAction({
                name: user.name,
                email: user.email,
                id: user._id
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

        if(!user.isVerified)
        {
            return res.json(failAction('User is not verified. Please Verify you email.'))
        }

        if (!user.authenticate(password)) {
            return res.status(401).json(
                failAction("Email and password do not match.")
            )
        }


        // create a token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send response to frontend

        const { _id, email, name, role } = user;

        res.json(
            successAction({
                token,
                user: { _id, email, name, role }
            })
        )
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
    console.log("AUTH: " + req.auth._id)

    console.log("PROF: " + req.profile._id)
    let checker = req.profile && req.auth && req.auth._id == req.profile._id;

    if (!checker) {
        res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}


exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(403).json({
            error: "You are not admin, ACCESS DENIED"
        })
    }
    next();
}

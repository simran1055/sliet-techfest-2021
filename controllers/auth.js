import User from "../models/user";

import { check, cookie, validationResult } from "express-validator";
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signUp = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }


    const user = new User(req.body);

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Not able to Sign Up. Some error ocuured"
                // error: err
            })
        }

        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
        // res.json(user)
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
            return res.status(400).json({
                error: "Email Id not registered with us."
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match."
            })
        }


        // create a token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        // put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send response to frontend

        const { _id, email, name, role } = user;

        res.json({
            token,
            user: { _id, email, name, role }
        })
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
    algorithms: ['RS256']
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.auth._id === req.profile._id;

    if (!checker) {
        res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}


exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        res.status(403).json({
            error: "You are not admin, ACCESS DENIED"
        })
    }
    next();
}

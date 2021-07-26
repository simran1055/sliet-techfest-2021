const express = require('express');
const { check } = require("express-validator")
const { signIn, signUp, signOut, verify, changePassword, resetPassword, otpVerification } = require('../controllers/auth.js');
const { isAuthenticated, isSignedIn, isAdmin, isAuthenticatedFn, isVerifiedCheck, hasPaidEntryCheck, isProfileCompleteCheck } = require("../controllers/auth");

var router = express.Router()

router.post(
    "/signup",
    [
        check("name", "name should be at least 3 chars").isLength({ min: 3 }),
        check("email", "email is required").isEmail(),
        check("password", "password should be at least 3 chars").isLength({
            min: 3
        })
    ],
    signUp
);

router.post("/signin", [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({
        min: 1
    })
], signIn);

router.post("/verify", verify);
router.post("/change-password", isSignedIn, isAuthenticatedFn, changePassword);
router.post("/reset-password", resetPassword);
router.post("/send-otp", otpVerification);



router.get("/signout", signOut);

module.exports = router;
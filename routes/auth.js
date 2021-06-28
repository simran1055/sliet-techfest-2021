var router = express.Router()

import Joi from 'joi';
import express from 'express';
import { check } from "express-validator"

import { signIn, signUp, signOut, verify } from '../controllers/auth.js';

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

router.get("/signout", signOut);

export default router;
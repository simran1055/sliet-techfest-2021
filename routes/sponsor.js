import express from 'express';
var router = express.Router();
import { check } from "express-validator"
import { sponsorsList, addSponsor, profileUpdate } from "../controllers/sponsor"
import { isAuthenticated, isSignedIn, isAdmin } from "../controllers/auth"

router.post('/add-sponsors',
    [
        check("orgName", "Organization name should be at least 3 chars").isLength({ min: 3 }),
        check("orgEmail", "Organization email is required").isEmail()
    ],
    addSponsor);

router.get('/sponsors-list', sponsorsList);

router.post('/sponsors-profile-update', profileUpdate)

export default router;
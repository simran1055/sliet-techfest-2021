const express = require('express');;
var router = express.Router();
import { check } from "express-validator"
import { sponsorsList, addSponsor, profileUpdate, adminSponsorList } from "../controllers/sponsor"
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth")


// Add Sponsors 
router.post('/add-sponsors',
    [
        check("orgName", "Organization name should be at least 3 chars").isLength({ min: 3 }),
        check("orgEmail", "Organization email is required").isEmail(),
        check("orgNumber", "Organization Number should be at least 6 chars").isLength({ min: 6 }),
    ], isSignedIn, isAdmin, isAuthenticated,
    addSponsor);

// Sponsor List for frontend
router.get('/sponsors-list', sponsorsList);

// Sponsor List for Admin
router.get('/admin-sponsors-list', isSignedIn, isAdmin, isAuthenticated, adminSponsorList);

// Profile Update
router.post('/sponsors-profile-update', isSignedIn, isAdmin, isAuthenticated, profileUpdate)

module.exports = router;
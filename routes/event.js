const express = require('express');;
const { createEvent } = require('../controllers/event')
const { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin } = require("../controllers/auth")

const router = express.Router();

router.post('/create-event', isSignedIn, isAdmin, isAuthenticated, createEvent);

module.exports = router;
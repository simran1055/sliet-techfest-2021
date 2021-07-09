const express = require('express');;
const { createEvent, updateEvent, eventListAdmin, eventList, deleteEvent, eventVerify } = require('../controllers/event')
const { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin, isAuthenticatedFn } = require("../controllers/auth")

const router = express.Router();

router.post('/create-event', isSignedIn, isAuthenticatedFn, createEvent);
router.post('/update-event', isSignedIn, isAuthenticatedFn, updateEvent);
router.post('/delete-event', isSignedIn, isAuthenticatedFn, deleteEvent);
router.post('/event-list-admin', isSignedIn, isAuthenticatedFn, eventListAdmin);
router.post('/event-list', isSignedIn, isAuthenticatedFn, eventList);
router.post('/event-verify', isSignedIn, isAuthenticatedFn, eventVerify)

module.exports = router;
const express = require('express');;
const { createEvent, updateEvent, eventListAdmin, eventList, deleteEvent, eventVerify } = require('../controllers/event')
const { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin, isAuthenticatedFn } = require("../controllers/auth")

const router = express.Router();

router.post('/create-event', isSignedIn, isAdmin, isAuthenticatedFn, createEvent);
router.post('/update-event', isSignedIn, isAdmin, isAuthenticatedFn, updateEvent);
router.post('/delete-event', isSignedIn, isAdmin, isAuthenticatedFn, deleteEvent);
router.post('/event-list-admin', isSignedIn, isAdmin, isAuthenticatedFn, eventListAdmin);
router.post('/event-list', isSignedIn, isAuthenticatedFn, eventList);
router.post('/event-verify', isSignedIn, isAdmin, isAuthenticatedFn, eventVerify)

module.exports = router;
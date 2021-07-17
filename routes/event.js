const express = require('express');;
const { createEvent, updateEvent, eventListAdmin, eventList, deleteEvent, eventVerify, getEvent } = require('../controllers/event')
const { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin, isAuthenticatedFn } = require("../controllers/auth")

const router = express.Router();

router.post('/create-event', isSignedIn, isAuthenticatedFn, isSuperAdmin, createEvent);
router.post('/update-event', isSignedIn, isAuthenticatedFn, isSuperAdmin, updateEvent);
router.post('/delete-event', isSignedIn, isAuthenticatedFn, isSuperAdmin, deleteEvent);
router.post('/event-list-admin', isSignedIn, isAuthenticatedFn, eventListAdmin);
router.post('/event-list', eventList);
router.post('/get-event', getEvent);
router.post('/event-verify', isSignedIn, isAuthenticatedFn, eventVerify)

module.exports = router;
const express = require('express')
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isSuperAdmin } = require("../controllers/auth")
const { getEventById, getEvent, createEvent, deleteEvent, updateEvent, getAllEvents, photo } = require("../controllers/event")

var router = express.Router()

router.param('userId', getUserById);
router.param('eventId', getEventById);
router.post(
    "/event/create/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    createEvent
);
router.get("/event/:eventId", getEvent);
router.get("/events", getAllEvents);
router.put(
    "/event/:eventId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    updateEvent
);
router.delete(
    "/event/:eventId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    deleteEvent
);

router.get("/event/photo/:eventId", photo);
module.exports = router;

// const express = require('express');;
// const { createEvent, updateEvent, eventListAdmin, eventList, deleteEvent, eventVerify, getEvent } = require('../controllers/event')
// const { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin, isAuthenticatedFn } = require("../controllers/auth")

// const router = express.Router();

// router.post('/create-event', isSignedIn, isAuthenticatedFn, isSuperAdmin, createEvent);
// router.post('/update-event', isSignedIn, isAuthenticatedFn, isSuperAdmin, updateEvent);
// router.post('/delete-event', isSignedIn, isAuthenticatedFn, isSuperAdmin, deleteEvent);
// router.post('/event-list-admin', isSignedIn, isAuthenticatedFn, eventListAdmin);
// router.post('/event-list', eventList);
// router.post('/get-event', getEvent);
// router.post('/event-verify', isSignedIn, isAuthenticatedFn, eventVerify)

// module.exports = router;
const express = require('express');;
var router = express.Router();
const { getUserId, getUserById, getUser, updateUser, notify, campusAmbassador, campusAmbassadorListAdmin, campusAmbassadorList, updateTeam, createTeam, removeTeamMember, acceptTeamLink, testMessage, enrollUserinWorkshop, enrollUserinEvent } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isAdmin, isAuthenticatedFn, isVerifiedCheck, hasPaidEntryCheck, isProfileCompleteCheck } = require("../controllers/auth");
const { getWorkshopById } = require('../controllers/workshop');
const { getEventById } = require('../controllers/event');

// Capmus Ambassador Routes
router.post('/user/campus-ambassador', isSignedIn, isAuthenticatedFn, campusAmbassador);
router.post('/user/campus-ambassador-list-admin', isSignedIn, isAuthenticatedFn, campusAmbassadorListAdmin);
router.post('/user/campus-ambassador-list', isSignedIn, isAuthenticatedFn, campusAmbassadorList);

// Team Routes 
router.post('/user/create-team', isSignedIn, isAuthenticatedFn, isProfileCompleteCheck, createTeam);
router.post('/user/accept-team', acceptTeamLink);
router.post('/user/remove-team-member', isSignedIn, isAuthenticatedFn, removeTeamMember)
router.post('/user/update-team', isSignedIn, isAuthenticatedFn, updateTeam)

// Users Route
router.param('userId', getUserById);
// router.get('/user/:userId', isSignedIn, isAuthenticated, isVerified, getUser);
// router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
router.get('/user/:userId', getUser);
// router.get('/user/:userId', isSignedIn, isAuthenticated, isVerified, updateUser);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

// Notification Routes
router.post('/user/notify', notify)
router.post('/user/test-message', testMessage)
router.post('/user/get-id', isSignedIn, isAuthenticatedFn, getUserId)

//////////// workshop related

router.param('workshopId', getWorkshopById);

router.post('/user/:userId/workshop/:workshopId', isSignedIn, isAuthenticated, isVerifiedCheck, isProfileCompleteCheck, enrollUserinWorkshop)

//////////// workshop related

router.param('eventId', getEventById);

router.post('/user/:userId/event/:eventId', isSignedIn, isAuthenticated, isVerifiedCheck, hasPaidEntryCheck, isProfileCompleteCheck, enrollUserinEvent)

// /// get registered events
// router.get('/user/:userId', isSignedIn, isAuthenticated, getRegisteredEvents);


// //// get registered workshops

// router.get('/user/:userId', isSignedIn, isAuthenticated, getRegisteredWorkshops);



module.exports = router;
const express = require('express');;
var router = express.Router();
const { getUserById, getUser, updateUser, notify, campusAmbassador, campusAmbassadorListAdmin, campusAmbassadorList, createTeam, testMessage } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isAdmin, isAuthenticatedFn } = require("../controllers/auth")

// Capmus Ambassador Routes
router.post('/user/campus-ambassador', isSignedIn, isAuthenticatedFn, campusAmbassador);
router.post('/user/campus-ambassador-list-admin', isSignedIn, isAuthenticatedFn, campusAmbassadorListAdmin);
router.post('/user/campus-ambassador-list', isSignedIn, isAuthenticatedFn, campusAmbassadorList);

// Team Routes 
router.post('/user/create-team', isSignedIn, isAuthenticatedFn, createTeam);

// Users Route
router.param('userId', getUserById);
// router.get('/user/:userId', isSignedIn, isAuthenticated, isVerified, getUser);
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
// router.get('/user/:userId', isSignedIn, isAuthenticated, isVerified, updateUser);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

// Notification Routes
router.post('/user/notify', notify)
router.post('/user/test-message', testMessage)

module.exports = router;
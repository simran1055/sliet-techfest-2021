const express = require('express');;
var router = express.Router();
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isAdmin } = require("../controllers/auth")

router.param('userId', getUserById);
// router.get('/user/:userId', isSignedIn, isAuthenticated, isVerified, getUser);
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
// router.get('/user/:userId', isSignedIn, isAuthenticated, isVerified, updateUser);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.post('/user/notify', notify)


module.exports = router;
const express = require('express')
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isSuperAdmin } = require("../controllers/auth")
const { getWorkshopSessionById, getWorkshopSession, createWorkshopSession, deleteWorkshopSession, updateWorkshopSession, getAllWorkshopSessions, photo } = require("../controllers/workshopSession")

var router = express.Router()

router.param('userId', getUserById);
router.param('workshopSessionId', getWorkshopSessionById);
router.post(
    "/workshopSession/create/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    createWorkshopSession
);
router.get("/workshopSession/:workshopSessionId", getWorkshopSession);
router.get("/workshopSessions", getAllWorkshopSessions);
router.put(
    "/workshopSession/:workshopSessionId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    updateWorkshopSession
);
router.delete(
    "/workshopSession/:workshopSessionId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    deleteWorkshopSession
);

module.exports = router;
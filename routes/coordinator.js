const express = require('express')
var router = express.Router()
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isSuperAdmin } = require("../controllers/auth")
const { getCoordinatorById, getCoordinator, createCoordinator, deleteCoordinator, updateCoordinator, getAllCoordinators, photo } = require("../controllers/coordinator")


router.param('userId', getUserById);
router.param('coordinatorId', getCoordinatorById);
router.post(
    "/coordinator/create/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    createCoordinator
);
router.get("/coordinator/:coordinatorId", getCoordinator);
router.get("/coordinators", getAllCoordinators);
router.put(
    "/coordinator/:coordinatorId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    updateCoordinator
);
router.delete(
    "/coordinator/:coordinatorId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    deleteCoordinator
);

router.get("/coordinator/photo/:coordinatorId", photo);
module.exports = router;
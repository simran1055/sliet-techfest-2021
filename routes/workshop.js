const express = require('express')
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isSuperAdmin } = require("../controllers/auth")
const { getWorkshopById, getWorkshop, createWorkshop, deleteWorkshop, updateWorkshop, getAllWorkshops, photo } = require("../controllers/workshop")

var router = express.Router()

router.param('userId', getUserById);
router.param('workshopId', getWorkshopById);
router.post(
    "/workshop/create/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    createWorkshop
);
router.get("/workshop/:workshopId", getWorkshop);
router.get("/workshops", getAllWorkshops);
router.put(
    "/workshop/:workshopId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    updateWorkshop
);
router.delete(
    "/workshop/:workshopId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    deleteWorkshop
);

router.get("/workshop/photo/:workshopId", photo);
module.exports = router;
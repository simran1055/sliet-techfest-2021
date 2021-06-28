const express = require('express')
var router = express.Router()
const { getUserById, getUser, updateUser, notify } = require("../controllers/user")
const { isAuthenticated, isSignedIn, isSuperAdmin } = require("../controllers/auth")
const { getDomainById, getDomain, createDomain, deleteDomain, updateDomain, getAllDomains, photo } = require("../controllers/domain")


router.param('userId', getUserById);
router.param('domainId', getDomainById);
router.post(
    "/domain/create/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    createDomain
);
router.get("/domain/:domainId", getDomain);
router.get("/domains", getAllDomains);
router.put(
    "/domain/:domainId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    updateDomain
);
router.delete(
    "/domain/:domainId/:userId",
    isSignedIn,
    isAuthenticated,
    isSuperAdmin,
    deleteDomain
);

router.get("/domain/photo/:domainId", photo);
module.exports = router;
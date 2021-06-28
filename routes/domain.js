import express from "express";
var router = express.Router()
import { check } from "express-validator"
import { getUserById, getUser, updateUser, notify } from "../controllers/user"
import { isAuthenticated, isSignedIn, isSuperAdmin } from "../controllers/auth"
import { getDomainById, getDomain, createDomain, deleteDomain, updateDomain, getAllDomains, photo } from "../controllers/domain"


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
export default router;
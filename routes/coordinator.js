import express from "express";
var router = express.Router()
import { check } from "express-validator"
import { getUserById, getUser, updateUser, notify } from "../controllers/user"
import { isAuthenticated, isSignedIn, isSuperAdmin } from "../controllers/auth"
import { getCoordinatorById, getCoordinator, createCoordinator, deleteCoordinator, updateCoordinator, getAllCoordinators, photo } from "../controllers/coordinator"


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
export default router;
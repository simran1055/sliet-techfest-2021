import express from 'express';
var router = express.Router();
import { getUserById, getUser, updateUser, notify } from "../controllers/user"
import { isAuthenticated, isSignedIn, isAdmin } from "../controllers/auth"

router.param('userId', getUserById);
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.post('/user/notify', notify)


export default router;
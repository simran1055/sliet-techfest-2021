import express from 'express';
import { createEvent } from '../controllers/event'
import { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin } from "../controllers/auth"

const router = express.Router();

router.post('/create-event', isSignedIn, isAdmin, isAuthenticated, createEvent);

export default router;
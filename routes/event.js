const express = require('express');;
import { createEvent } from '../controllers/event'
import { isAuthenticated, isSignedIn, isAdmin, isSuperAdmin } from "../controllers/auth"

const router = express.Router();

router.post('/create-event', isSignedIn, isAdmin, isAuthenticated, createEvent);

module.exports = router;
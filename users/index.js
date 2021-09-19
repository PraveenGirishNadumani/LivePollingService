import { Router } from "express";
import * as controller from "./controller.js"
import * as auth from "./auth.js";

const router = Router();

router.post('/login', controller.login);
router.post('/register', controller.registerUser)

router.get('/', auth.isAuthenticated, controller.getMyDate);
router.get('/poll', auth.isAuthenticated, controller.getMyPolls);

export default router;
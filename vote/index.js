import { Router } from "express";
import * as controller from "./controller.js"
import * as auth from "../users/auth.js";

const router = Router();

router.post('/', auth.isAuthenticated, controller.voteToPoll);


export default router;
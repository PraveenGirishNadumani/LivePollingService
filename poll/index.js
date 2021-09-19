import { Router } from "express";
import * as controller from "./controller.js"
import * as auth from "../users/auth.js";

const router = Router();

router.get('/', controller.getAll); /**Get all active Poll List */
router.post('/', auth.isAuthenticated, controller.create); /**Create a Poll */
router.get('/:id', auth.isAuthenticated, controller.get); /**get a Poll data by ID, which includes poll status and the current vote counts */
router.put('/:id', auth.isAuthenticated, controller.update); /**Update poll name and status we can extend it to update poll options too */
router.delete('/:id', auth.isAuthenticated, controller.archive); /**API for archiving a Poll so that FE can handle it accordingly */
router.get('/:id/getNotifyEmailList', auth.isAuthenticated, controller.getEmailListToNotifyResult); /**Returns a list of emailIDs who wanted to get the poll result notification */


export default router;
import { Router } from "express";
const router = Router();
import {verifyUserByToken} from "../middlewares/auth.middleware.mjs"
import { togglefollowers } from "../controller/followers.controller.mjs";
router.use(verifyUserByToken);


router.route("/start-following/:createrId").post(togglefollowers)


export default router
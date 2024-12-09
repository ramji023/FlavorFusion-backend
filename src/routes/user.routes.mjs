import { Router } from "express";
const router = Router();


//handling the registeration of the user
import { registerUser } from "../controller/user.controller.mjs";
router.route("/register").post(registerUser);





export default router;

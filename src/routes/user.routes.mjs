import { Router } from "express";
const router = Router();
import { upload } from "../middlewares/multer.middleware.mjs";  //handling files from client side using multer middleware


//handling the registeration of the user
import { registerUser } from "../controller/user.controller.mjs";
router.route("/register").post(
    upload.single("avatar"),
    registerUser
);





export default router;

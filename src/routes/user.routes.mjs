import { Router } from "express";
const router = Router();
import { upload } from "../middlewares/multer.middleware.mjs";  //handling files from client side using multer middleware
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs";

//handling the registeration of the user
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.mjs";
router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

router.route("/login").post(loginUser)

//secured route 
router.route("/logout").post(
    verifyUserByToken,
    logoutUser,
)

export default router;

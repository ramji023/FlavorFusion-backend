import { Router } from "express";
const router = Router();
import { upload } from "../middlewares/multer.middleware.mjs";  //handling files from client side using multer middleware
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs";


//handling the registeration of the user
import { loginUser, logoutUser, registerUser,refreshedAccessToken ,currentUserData} from "../controller/user.controller.mjs";
import { handleGlobalError } from "../middlewares/error.middleware.mjs";
router.route("/register").post(
    // upload.single("avatar"),
    registerUser
);

router.route("/login").post(loginUser)

router.route("/current-user").post(verifyUserByToken,currentUserData);
//secured route 
router.route("/logout").post(
    verifyUserByToken,
    logoutUser,
)

router.route("/refreshed-token").post(refreshedAccessToken);
export default router;

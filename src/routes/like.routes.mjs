import { Router } from "express";
const router = Router();
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs";
router.use(verifyUserByToken)  //always use auth middleware to likes the video

import { toggleRecipeLike, likeCommentByUser } from "../controller/like.controller.mjs";

router.route("/like-recipe/:recipeId").post(toggleRecipeLike)   //handle routes if user like or dislike any recipe
   
router.route("/like-comment/:commentId").post(likeCommentByUser) //handle routes if user like the comment

export default router;
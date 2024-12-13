import { Router } from "express";
const router = Router();
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs";
router.use(verifyUserByToken)  //always use auth middleware to likes the video

import { toggleRecipeLike, toggleCommentLike } from "../controller/like.controller.mjs";

router.route("/like-recipe/:recipeId").post(toggleRecipeLike)   //handle routes if user like or dislike any recipe
  
router.route("/like-comment/:recipeId/:commentId").post(toggleCommentLike) //handle routes if user like or dislike the comment

export default router;
import { Router } from "express";
const router = Router();
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs";
import { createComment } from "../controller/comment.controller.mjs";
router.use(verifyUserByToken)  //always use auth middleware to comment on a recipe

router.route("/write-comment/:recipeId").post(createComment)  // user can write the comment



export default router;
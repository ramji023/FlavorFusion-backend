import { Router } from "express";
const router = Router();
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs"
router.use(verifyUserByToken);

import { clickFavRecipe } from "../controller/favRecipe.controller.mjs";
router.route("/save-recipe/:recipeId").post(clickFavRecipe);

export default router
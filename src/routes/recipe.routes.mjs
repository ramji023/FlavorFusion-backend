import { Router } from "express";
const router = Router();
import { verifyUserByToken } from "../middlewares/auth.middleware.mjs"
import { addNewRecipe, getAllRecipe, getRecipeById } from "../controller/recipe.controller.mjs";
import { upload } from "../middlewares/multer.middleware.mjs"

router.route("/add-recipe").post(
    verifyUserByToken,
    upload.fields([
        {
            name: "recipeVideo",
            maxCount: 1
        },
        {
            name: "images",
            maxCount: 5
        }
    ]),
    addNewRecipe)

router.route("/get-recipe").get(verifyUserByToken, getAllRecipe);

router.route("/get-recipe/:id").get(getRecipeById);

export default router;
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { errorHandler } from "../utils/errorHandler.mjs";
import { responseHandler } from "../utils/reponseHandler.mjs";
import { Comment } from "../models/comment.model.mjs";
import { Recipe } from "../models/recipe.model.mjs";
import mongoose from "mongoose";


const createComment = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new errorHandler(404, "unauthorized user");
    }

    const userId = req.user._id

    // check we get the recipe id or not
    if (!req.params && !mongoose.Types.ObjectId.isValid(req.params)) {
        throw new errorHandler(404, "somthing is wrong while getting recipeId")
    }
    const { recipeId } = req.params;

    //check wheather is recipeId present in database or not
    const existedRecipe = await Recipe.findById(recipeId);

    if (!existedRecipe) {
        throw new errorHandler(403, "recipe doesnot exist in database");
    }

    // now we check if we get the content of comment or not
    const { content } = req.body;
    if (!content) {
        throw new errorHandler(401, "please write somthing in comment box");
    }


    const commentData = await Comment.create({
        content,
        recipeId,
        createdBy: userId,
    })

    // console.log(commentData);
    return res.status(201).json(
        new responseHandler(201, {}, "user comment successfully")
    )
})

export { createComment }
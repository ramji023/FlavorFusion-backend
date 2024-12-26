import mongoose from "mongoose";
import { FavRecipe } from "../models/FavouriteRecipe.model.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { errorHandler } from "../utils/errorHandler.mjs";
import { responseHandler } from "../utils/reponseHandler.mjs";
import { Recipe } from "../models/recipe.model.mjs";

const clickFavRecipe = asyncHandler(async (req, res) => {
    // get user details from authorized token
    const userId = req.user._id
    if (!userId) {
        throw new errorHandler(401, "unauthorized user")
    }
    // get the recipe id from params
    const { recipeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        throw new errorHandler(401, "invalid recipe id")
    }


    //now check this recipe id exist or not
    const existedRecipe = await Recipe.findById(recipeId)
    if (!existedRecipe) {
        throw new errorHandler("there is no recipe in database")
    }


    // now get the user action from user side through query
    // Get user action from query
    const { save } = req.query;

    // Convert `save` to a boolean
    const saveStatus = save === "true" ? true : save === "false" ? false : null;

    // Check if the conversion was successful
    if (saveStatus === null) {
        throw new errorHandler(400, "Invalid save query parameter");
    }

    console.log(userId)
    console.log(recipeId)
    console.log(saveStatus)

    // if exist then check if user mark favourite or not
    const existedFavRecipe = await FavRecipe.findOne({
        recipeId,
        savedBy: userId,
    })

    if (existedFavRecipe) {
        // if already exist then
        existedFavRecipe.saveStatus = save
        await existedFavRecipe.save({ validateBeforeSave: false });
        return res.status(201).json(
            new responseHandler(201, `user ${save} successfully `)
        )
    } else {
        // if not existed then create it
        FavRecipe.create({
            recipeId,
            savedBy: userId,
            saveStatus,
        })
        return res.status(201).json(
            new responseHandler(201, `user ${save} successfully `)
        )
    }
})

const getAllSavedRecipeByUser = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        throw new errorHandler(401, "unauthorized user..")
    }

    //if user exist then
    const pipeline = [
        {
            $match: {
                savedBy: new mongoose.Types.ObjectId(user._id),
                saveStatus: true
            }
        }
    ]
    try {
        const allSavedRecipeByUser = await FavRecipe.aggregate(pipeline)
        if (allSavedRecipeByUser.length === 0 || allSavedRecipeByUser) {
            return res.status(200).json(
                new responseHandler(200, allSavedRecipeByUser, "all saved recipe fetch successfully..")
            )
        }
    } catch (err) {
        console.log(err)
        throw new errorHandler(404, "something is wrong while fetching saved recipe by user")
    }


})



export { clickFavRecipe, getAllSavedRecipeByUser }
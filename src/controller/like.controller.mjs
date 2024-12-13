import { Like } from "../models/like.model.mjs";
import { Recipe } from "../models/recipe.model.mjs"
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { errorHandler } from "../utils/errorHandler.mjs";
import { responseHandler } from "../utils/reponseHandler.mjs";
import mongoose , {Schema} from "mongoose"

//if user like or dislike any recipe
const toggleRecipeLike = asyncHandler(async (req, res) => {


    //first check user is authenticate or not
    const userId = req.user._id;
    if (!userId) {
        throw new errorHandler(404, "unauthorized user")
    }
    //check if we get the params from the url or not
    if (!req.params) {
        throw new errorHandler(404, "something is wrong while getting recipe id ")
    }
    //check we get query parameters or not
    if (!req.query) {
        throw new errorHandler(400, "something is wrong while getting status")
    }

    const { recipeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ error: "Invalid recipe ID" });
    }
    const { action } = req.query;

    if (!(action === "like" || action === "dislike")) {
        throw new errorHandler(404, "please enter valid input");
    }
    console.log("user id is ", userId);
    console.log("recipe id is ", recipeId)
    console.log("action : ", action);

    //now check that recipe is exist in database or not
    const existedRecipe = await Recipe.findById(recipeId);
    if (!existedRecipe) {
        throw new errorHandler(404, "recipe does not exist in database")
    }

    // now check user has already like or dislike the recipe or not
    const findLikedDocument = await Like.findOne({
        recipe: recipeId,
        likedBy: userId
    })

    //if exist then just update it 
    if (findLikedDocument) {
        findLikedDocument.status = action
        await findLikedDocument.save({ validateBeforeSave: false });
        return res.status(201).json(
            new responseHandler(201, {}, "user liked or disliked successfully")
        )
    } else {
        //if not exist then new create it
        await Like.create({
            recipe: recipeId,
            likedBy: userId,
            status: action,
        })
    }

    return res.status(201).json(
        new responseHandler(201, {}, "user liked or disliked successfully")
    )
})


//if user like any comment
const toggleCommentLike = asyncHandler(async (req, res) => {
      
})




export { toggleCommentLike, toggleRecipeLike }
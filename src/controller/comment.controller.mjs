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

const getCommentByRecipeId = asyncHandler(async (req, res) => {
    const { recipeId } = req.params;
    //if user did not get recipe Id
    if (!recipeId) {
        throw new errorHandler(404, "did not got recipe id")
    }

    //define a pipeline to fetch all comments on a specific recipe
    const pipeline = [
        {
            $match: {
                // recipeId: ObjectId('6763d64f9cd1aed3d5aff4ce')
                recipeId: new mongoose.Types.ObjectId(recipeId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creatorData"
            }
        },
        {
            $project: {
                content: 1,
                creatorName: { $arrayElemAt: ["$creatorData.username", 0] }
            }
        }
    ]

    try {
        const allComments = await Comment.aggregate(pipeline);

        if (allComments.length === 0) {
            return res.status(200).json(
                new responseHandler(200, allComments, "There are no comments on this recipe")
            );
        }

        return res.status(200).json(
            new responseHandler(200, allComments, "All comments fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw new errorHandler(500, "Failed to fetch comments");
    }
})

export { createComment, getCommentByRecipeId }
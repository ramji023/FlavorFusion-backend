import mongoose, { Schema } from "mongoose";

const favouriteRecipe = new Schema({
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
    },
    savedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    saveStatus: {
        type: Boolean,
    }
}, { timestamps: true })


export const FavRecipe = mongoose.model("FavRecipe", favouriteRecipe);
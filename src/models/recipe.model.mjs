import mongoose, { Schema } from "mongoose";


const recipeSchema = new Schema({

});

export const Recipe = mongoose.model("Recipe", recipeSchema);
import mongoose, { Schema } from "mongoose";


const recipeSchema = new Schema({
    recipeTitle: {
        type: String,
        required: [true, "title is required."],
    },
    recipeVideo: {
        type: String,
    },
    description: {
        type: String,
        default: "No description provided"
    },
    ingredients: [
        {
            type: String,
            required: true,
        }
    ],
    instructions: [
        {
            stepNumber: { type: Number, required: true },
            text: { type: String, required: true },
        }
    ],
    prepTime: {
        type: String,
        required: true,
    },
    cookTime: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: [
        {
            type: String,
        }
    ]
}, { timestamps: true });

export const Recipe = mongoose.model("Recipe", recipeSchema);
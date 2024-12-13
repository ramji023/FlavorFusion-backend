import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    recipeId: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema);
import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    recipe: {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ["like", "dislike"],
    }
}, { timestamps: true })


export const Like = mongoose.model("Like", likeSchema);
import mongoose, { Schema } from "mongoose";

const followersSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    creater: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })


export const Followers = mongoose.model("Followers", followersSchema)

import mongoose from "mongoose";
import { Followers } from "../models/followers.model.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs"
import { errorHandler } from "../utils/errorHandler.mjs"
import { responseHandler } from "../utils/reponseHandler.mjs"
import { User } from "../models/User.model.mjs";

const togglefollowers = asyncHandler(async (req, res) => {
    // first check user is authenticated or not
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new errorHandler(404, "unauthorized user or expired token")
    }

    // now check if we get valid creater id or not
    const { createrId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(createrId)) {
        throw new errorHandler(401, "invalid creater id")
    }

    // now check wheather this creater is exist in our database or not
    const existedCreater = await User.findById(createrId)
    if (!existedCreater) {
        throw new errorHandler(404, "creater does not exist")
    }

    // if created exist then check if user already follow the creater or unfollow
    const checkalreadyFollowOrNot = await Followers.findOne({
        user: userId,
        creater: createrId,
    })

    // if its true means user click to unfollow button
    //if its false means user click to follow button
    if (!checkalreadyFollowOrNot) {
        await Followers.create({
            user: userId,
            creater: createrId,
        })

        return res.status(200).json(
            new responseHandler(200, {}, "user follow successfully")
        )
    } else {
        await Followers.deleteOne({
            user: userId,
            creater: createrId,
        })
        return res.status(200).json(
            new responseHandler(200, {}, "user unfollow successfully")
        )
    }
})

export { togglefollowers }
import { asyncHandler } from "../utils/asyncHandler.mjs";
import { errorHandler } from "../utils/errorHandler.mjs";
import jwt from "jsonwebtoken"
import { User } from "../models/User.model.mjs";

export const verifyUserByToken = asyncHandler(async (req, res, next) => {
    try {
        if (!req.cookies && !req.header("Authorization")) {
            throw new errorHandler(401, "token is expired or already used")
        }
        //now get the token
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
        // console.log(token);
        //check if we dont get token
        if (!token) {
            throw new errorHandler(404, "unauthorized or expired token");
        }
        // now we have to decode the token
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
        //    console.log(decodedToken);

        //now we get user from decodedToken
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new errorHandler(404, "user has invalid token")
        }
        // console.log(user);
        //now if find the user then create a new object of request
        req.user = user;
        next();
    } catch (err) {
        throw new errorHandler(404, "something is wrong while calling auth middleware")
    }
})
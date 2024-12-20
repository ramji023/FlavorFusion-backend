import { asyncHandler } from "../utils/asyncHandler.mjs";
import { errorHandler } from "../utils/errorHandler.mjs";
import { User } from "../models/User.model.mjs";
import jwt from "jsonwebtoken"

export const verifyUserByToken = asyncHandler(async (req, res, next) => {
    try {
        // Check if the token is present in cookies or headers
        if (!req.cookies.accessToken && !req.header("Authorization")) {
            throw new errorHandler(401, "Token not provided");
        }


        // Get the token from cookies or headers
        const token = req.cookies.accessToken || req.header("Authorization").replace("Bearer ", "");
        // Check if the token exists
        if (!token) {
            throw new errorHandler(401, "Unauthorized or expired token");
        }
        // console.log("token is : ", token)
        // Decode the token
        let decodedToken
        let user
        try {
            decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
            // console.log("decode token is ", decodedToken);
        } catch (error) {
            console.log(error);
            throw new errorHandler(401, "token is expired")
        }
        try {
            // Get the user from the decoded token
            user = await User.findById(decodedToken._id).select("-password -refreshToken");
            console.log("find the user : ", user);
        } catch (error) {
            console.log(error);
            throw new errorHandler(401, "user not found")
        }

        // If no user is found, throw an error
        if (!user) {
            throw new errorHandler(401, "User has invalid token");
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (err) {
        // If the error is an instance of errorHandler, rethrow it
        if (err instanceof errorHandler) {
            throw err;
        }

        // Otherwise, throw a generic error
        throw new errorHandler(500, "Something went wrong while calling auth middleware");
    }
});

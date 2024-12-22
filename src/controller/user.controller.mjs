import { User } from "../models/User.model.mjs"
import { asyncHandler } from "../utils/asyncHandler.mjs"
import { errorHandler } from "../utils/errorHandler.mjs"
import { responseHandler } from "../utils/reponseHandler.mjs"
import { validateEmail } from "../constant.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"
import jwt from "jsonwebtoken"

//define a functions to generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        //find the user through user object id
        const findUser = await User.findById(userId);
        if (!findUser) {
            throw new errorHandler(404, "user not found")
        }
        const accessToken = findUser.createJWTacessToken();
        const refreshToken = findUser.createJWTrefreshToken();
        //now save the refreshToken in database
        findUser.refreshToken = refreshToken;
        await findUser.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (err) {
        throw new errorHandler(500, "something is wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { username, email, password } = req.body;

    // first check all fields are mandatory
    if (!username || !email || !password) {
        throw new errorHandler(
            401,
            "all fields are required",
        )
    }

    // check email validation
    if (!validateEmail(email)) {
        throw new errorHandler(401, "invlaid email format")
    }

    // check user already exist or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new errorHandler(409, "A user with this email or username already exists.")
    }

    //now create the user
    const createUser = await User.create(
        {
            username,
            email,
            password,
        }
    )

    if (!createUser) {
        throw new errorHandler(404, "something went wrong");
    }

    //define options
    const options = {
        httpOnly: true,
        secure: true,
    }
    //now generate token 
    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(createUser._id)
    // console.log({ refreshToken, accessToken })

    // now check user is successfully saved in database or not
    const registerUser = await User.findById(createUser._id).select("-password -refreshToken")
    return res.status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new responseHandler(201,
            {
                data: registerUser,
            },
            "user register successfully."));
});


const loginUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    //take the user details through req.body
    const { email, password } = req.body;
    //if both phone number or email filed are undefined
    if (!email && !password) {
        throw new errorHandler(401, "email and password is required")
    }
    // now run a mongoose query to find that user is present or not
    const existedUser = await User.findOne({
        $or: [{ email }]
    })
    // console.log(existedUser);
    if (!existedUser) {
        throw new errorHandler(401, "user is not present in database");
    }
    console.log("user exist : ", existedUser);
    //now if user is present then check password
    const checkPassword = await existedUser.isPasswordMatch(password);
    if (!checkPassword) {
        throw new errorHandler(404, "password is not matched");
    }

    //if password match then generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser._id);
    // console.log({ accessToken, refreshToken });
    //find the data of logged in user
    const loggedUser = await User.findById(existedUser._id).select("-password -refreshToken");
    console.log("logged in user  : ", loggedUser);
    // console.log(loggedUser);
    //define the options;
    const options = {
        httpOnly: true,
        secure: true,
    }

    //send the token to the client side through cookies
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new responseHandler(
                201,
                {
                    existedUser: loggedUser
                },
                "user logged in successfully"
            )
        )
})


const currentUserData = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new errorHandler(401, "user is invalid")
    }
    const user = req.user

    res.status(201).json(
        new responseHandler(201, user, "this user is now on application")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    /*
    now how can we get user details if user click to logout button ???
    -----> suppose if user on a logout button it means user already login and token are saved in their cookies
      and while generating the tokens we handle user details with tokens.
    so can we get user details from tokens ????
    ------> yes first we have to apply authenticate middleware so if user login then token should be save into cookies
    */

    //take user data through cookies

    const user = req.user;
    console.log("logout user : ", user);
    if (!user) {
        throw new errorHandler(404, "something is wrong")
    }

    // if user exist then set refreshToken by 1
    const existedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $unset: { refreshToken: 1 }
        }, {
        new: true
    })

    // console.log(user);

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(201)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new responseHandler(201, {}, "user logout successfully")
        )

})

const refreshedAccessToken = asyncHandler(async (req, res) => {
    /*
    now assume a scenerio if accesstoken is deleted from cookies after some time then how can we generate new access and refresh token for that users
    */

    //take refresh token from cookies
    const currentRefreshToken = req.cookies.refreshToken;
    // console.log(currentRefreshToken);

    //check refresh token is present or not
    if (!currentRefreshToken) {
        throw new errorHandler(401, " refresh token is expired or used")
    }

    // if present then decode the refresh token
    const decodedToken = jwt.verify(currentRefreshToken, process.env.SECRET_REFRESH_TOKEN)

    //now find the user from database 
    const findUser = await User.findById(decodedToken?._id);

    if (!findUser) {
        throw new errorHandler(401, "unauthorized token")
    }
    //now check current refresh token with the saved refresh token in database
    if (currentRefreshToken !== findUser.refreshToken) {
        throw new errorHandler(401, "refresh token is not matched")
    }

    //now generate the access token and new refresh token
    const { refreshToken: newrefreshToken, accessToken } = await generateAccessAndRefreshToken(findUser._id);

    // console.log({ newrefreshToken, accessToken })
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(201)
        .cookie("refreshToken", newrefreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new responseHandler(201,
                {
                },
                "refreshed refresh token successfully"
            )
        )
})
export { registerUser, loginUser, logoutUser, refreshedAccessToken, currentUserData };




// //check avatar existed or not and if exist then find the local path of avatar
// let avatarLocalPath = ""
// let avatarUrl = ""
// if (req.file && req.file.path) {
//     avatarLocalPath = req.file.path;

//     const avatar = await uploadOnCloudinary(avatarLocalPath);
//     // console.log(avatar);
//     //now check if we get the avatar url from cloudinary or not
//     if (!avatar) {
//         throw new errorHandler(404, "something is wrong with the cloudinary");
//     }
//     avatarUrl = avatar.url
// }

import { User } from "../models/User.model.mjs"
import { asyncHandler } from "../utils/asyncHandler.mjs"
import { errorHandler } from "../utils/errorHandler.mjs"
import { responseHandler } from "../utils/reponseHandler.mjs"
import { validateEmail } from "../constant.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"

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


    // console.log(req.file);
    // console.log(req.body);
    const { username, fullName, email, phoneNumber, password } = req.body;

    // first check all fields are mandatory
    if (!username || !fullName || !email || !phoneNumber || !password) {
        throw new errorHandler(
            401,
            "all fields are required",
        )
    }

    // check email validation
    if (!validateEmail(email)) {
        throw new errorHandler(402, "invlaid email format")
    }

    // check user already exist or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new errorHandler(409, "user alreayd exist in database.")
    }

    //check avatar existed or not and if exist then find the local path of avatar
    let avatarLocalPath = ""
    let avatarUrl = ""
    if (req.file && req.file.path) {
        avatarLocalPath = req.file.path;

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        // console.log(avatar);
        //now check if we get the avatar url from cloudinary or not
        if (!avatar) {
            throw new errorHandler(404, "something is wrong with the cloudinary");
        }
        avatarUrl = avatar.url
    }


    //now create the user
    const createUser = await User.create(
        {
            username,
            email,
            fullName,
            password,
            phoneNumber,
            avatar: avatarUrl,
        }
    )

    if (!createUser) {
        throw new errorHandler(404, "something went wrong");
    }
    return res.status(201).json(new responseHandler(201, createUser, "user register successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
    // console.log(req.body);
    //take the user details through req.body
    const { phoneNumber, email, password } = req.body;
    //if both phone number or email filed are undefined
    if (!phoneNumber && !email) {
        throw new errorHandler(401, "phone number or email is required")
    }
    // now run a mongoose query to find that user is present or not
    const existedUser = await User.findOne({
        $or: [{ phoneNumber }, { email }]
    })
    // console.log(existedUser);
    if (!existedUser) {
        throw new errorHandler(401, "user is not present in database");
    }
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
                    existedUser: loggedUser, accessToken, refreshToken
                },
                "user logged in successfully"
            )
        )
})


export { registerUser, loginUser };
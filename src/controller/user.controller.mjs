import { User } from "../models/User.model.mjs"
import { asyncHandler } from "../utils/asyncHandler.mjs"
import { errorHandler } from "../utils/errorHandler.mjs"
import { responseHandler } from "../utils/reponseHandler.mjs"
import { validateEmail } from "../constant.mjs"



const registerUser = asyncHandler(async (req, res) => {

    const { username, fullName, email, phoneNumber, password } = req.body;

    //first check all fields are mandatory
    if (!username || !fullName || !email || !phoneNumber || !password) {
        throw new errorHandler(
            401,
            "all fields are required",
        )
    }

    //check email validation
    if (!validateEmail(email)) {
        throw new errorHandler(402, "invlaid email format")
    }

    //check user already exist or not
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new errorHandler(409, "user alreayd exist in database.")
    }


    const createUser = await User.create(
        {
            username,
            email,
            fullName,
            password,
            phoneNumber,
        }
    )

    if (!createUser) {
        throw new errorHandler(404, "something went wrong");
    }
    res.status(201).json(new responseHandler(201, createUser, "everything is fine"));
})

export { registerUser };
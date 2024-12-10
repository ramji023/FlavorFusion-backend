import mongoose, { Schema } from "mongoose";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })




// define pre middleware for hashing the password
userSchema.pre("save", async function (next) {
    //first check the password it is modified or not
    if (!this.isModified("password")) {
        return next();
    }

    try {

        //now hash the password
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        console.log("something is wrong with the bcrypt function.", error);
        next(error);
    }
})

//define a method to check the hashed password
userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
}


//define a method to create jwt access token
userSchema.methods.createJWTacessToken = function () {
    const createAccessToken = jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName
    },
        process.env.SECRET_ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    )
    return createAccessToken;
}



//define a method to create jwt refresh token
userSchema.methods.createJWTrefreshToken = function () {
    const createRefreshToken = jwt.sign({
        _id: this._id,
    },
        process.env.SECRET_REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    )
    return createRefreshToken;
}







export const User = mongoose.model("User", userSchema);


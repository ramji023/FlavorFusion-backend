import { Recipe } from "../models/recipe.model.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs"
import { errorHandler } from "../utils/errorHandler.mjs"
import { responseHandler } from "../utils/reponseHandler.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"

//define controllers to add the recipe
const addNewRecipe = asyncHandler(async (req, res) => {
    //take authenticated user data from token
    const user = req.user  //take userId from the token
    console.log(user._id);
    // get recipe details through req.body
    const { recipeTitle, description, ingredients, instructions, prepTime, cookTime, } = req.body;

    //check any required field are empty or not 
    if (!recipeTitle) {
        throw new errorHandler(401, "title is required")
    }
    if (ingredients.length <= 0) {
        throw new errorHandler(401, "ingredients fields are required")
    }
    if (instructions.length <= 0) {
        throw new errorHandler(401, "instructions fields are required")
    }
    if (!prepTime || !cookTime) {
        throw new errorHandler(401, "time is required");
    }

    // now if user send any files then handle it through req.files
    // console.log("files details : ", req.files);


    //now handle files through req.files if user send files
    const imagesUrl = [];
    let videoUrl = "";

    if (req.files) {
        if (req.files["images"]) {
            // now iterate through the "images" array and upload on cloudinary
            for (const file of req.files["images"]) {
                // upload it on cloudinary
                const imageUploadResult = await uploadOnCloudinary(file.path);

                if (!imageUploadResult) {
                    throw new errorHandler(404, "something is wrong while getting images url form cloudinary")
                }
                // and get the url from cloudinary and push into imagesUrl
                imagesUrl.push(imageUploadResult.url);
            }
        }
        if (req.files["recipeVideo"][0]) {
            //upload video on cloudinary
            const videoUploadResult = await uploadOnCloudinary(req.files["recipeVideo"][0].path);
            //check we get the url form cloudinary or not
            if (!videoUploadResult) {
                throw new errorHandler(404, "something is wrong while getting video url form cloudinary")
            }
            videoUrl = videoUploadResult.url;
        }
    }

    // console.log(instructions);
    // console.log(typeof (instructions));
    const instruction = JSON.parse(instructions);  // here parse the array otherwise it consider as a string like this "[]"
    // console.log(typeof (instruction));



    //now create the object for recipe model
    const recipeData = await Recipe.create({
        recipeTitle,
        description,
        ingredients,
        instructions: instruction,
        prepTime,
        cookTime,
        createdBy: user._id,
        images: imagesUrl,
        recipeVideo: videoUrl,
    })

    //now check user is successfully saved in database or not
    const recipedata = await Recipe.find(recipeData._id).select("-createdBy");
    // console.log(recipedata);
    return res.status(201)
        .json(
            new responseHandler(201, recipedata, "recipe added successfully.")
        )
})


export { addNewRecipe };
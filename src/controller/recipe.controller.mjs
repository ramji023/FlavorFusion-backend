import { Recipe } from "../models/recipe.model.mjs";
import { asyncHandler } from "../utils/asyncHandler.mjs"
import { errorHandler } from "../utils/errorHandler.mjs"
import { responseHandler } from "../utils/reponseHandler.mjs"
import { uploadOnCloudinary } from "../utils/cloudinary.mjs"

//define controllers to add the recipe
const addNewRecipe = asyncHandler(async (req, res) => {
    // console.log(req.user)
    // console.log(req.body)
    // console.log(req.files);
    //take authenticated user data from token
    const user = req.user  //take userId from the token
    if (!user) {
        throw new errorHandler(404, "user is unauthorized");
    }
    // console.log(user._id);
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
                const imageUploadResult = await uploadOnCloudinary(file.path, "Flavor-Fusion/recipe/images");

                if (!imageUploadResult) {
                    throw new errorHandler(404, "something is wrong while getting images url form cloudinary")
                }
                // and get the url from cloudinary and push into imagesUrl
                imagesUrl.push(imageUploadResult.url);
            }
        }
        if (req.files["recipeVideo"][0]) {
            //upload video on cloudinary
            const videoUploadResult = await uploadOnCloudinary(req.files["recipeVideo"][0].path, "Flavor-Fusion/recipe/videos");
            //check we get the url form cloudinary or not
            if (!videoUploadResult) {
                throw new errorHandler(404, "something is wrong while getting video url form cloudinary")
            }
            videoUrl = videoUploadResult.url;
        }
    }

    // console.log(instructions);
    // console.log(typeof (ingredients));
    // console.log(typeof (instructions));
    const instruction = JSON.parse(instructions);  // here parse the array otherwise it consider as a string like this "[]"
    // console.log(typeof (instruction));
    const ingredient = JSON.parse(ingredients);


    //now create the object for recipe model
    const recipeData = await Recipe.create({
        recipeTitle,
        description,
        ingredients: ingredient,
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

//now fetch all the recipes
const getAllRecipe = asyncHandler(async (req, res) => {
    // Fetch all the recipes from the database
    let data = await Recipe.find();
    // console.log(`Number of recipes: ${data.length}`);
    // If there are no recipes
    if (data.length === 0) {
        return res.status(200).json(
            new responseHandler(200, [], "There are no recipes available at the moment")
        );
    }

    data = await Recipe.aggregate([
        {
            $lookup: {
                from: "users",  
                localField: "createdBy", 
                foreignField: "_id",  
                as: "userInfo"  
            }
        },
        {
            $unwind: "$userInfo"  
        },
        {
            $project: {
                _id: 1,  // Include the recipe ID
                recipeTitle: 1,  // Include the recipe title
                "userInfo.username": 1,  // Include the username
                "userInfo.avatar": 1,  // Include the avatar
                images: { $arrayElemAt: ["$images", 0] }  // Get the first image from the images array
            }
        }
    ]);

    //  console.log(data);


    // If recipes are found
    return res.status(200).json(
        new responseHandler(200, data, "Fetched all the recipes successfully")
    );
});

//get a recipe by their id
const getRecipeById = asyncHandler(async (req, res) => {
    // console.log(req.params)
    //first check if we get the recipe id from req.params
    if (!req.params) {
        throw new errorHandler(404, "Bad request..");
    }
    // if get the id then check there is any recipe exist in database with this id or not
    const { id: recipeId } = req.params;
    // console.log(recipeId);
    const existedRecipe = await Recipe.findById(recipeId);
    // console.log(existedRecipe);

    if (!existedRecipe) {
        throw new errorHandler(401, "there is no recipe in database");
    }

    //if recipe exist then
    return res.status(200).json(
        new responseHandler(200, existedRecipe, "fetch recipe by id successfully")
    )

})

// fetch all the recipe of a user
const getAllRecipeByCreater = asyncHandler(async (req, res) => {
    //TODO TASK
})
export { addNewRecipe, getAllRecipe, getRecipeById, getAllRecipeByCreater };
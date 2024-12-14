import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";


app.use(cors());
app.use(express.json({ limit: "100kb" }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.get("/test", (request,response)=>{
//     response.status(201).send({msg:"server is running now..."});
// })


import bodyParser from "body-parser";
//handling user operations
import userRouter from "./routes/user.routes.mjs";
app.use("/api/users", userRouter);    // http://localhost:8000/api/users/register

//handling recipe operations
import recipeRouter from "./routes/recipe.routes.mjs";
app.use("/api/recipes", recipeRouter); //http://localhost:8000/api/recipes/

//handling like operations
import likeRouter from "./routes/like.routes.mjs"
app.use("/api/likes", likeRouter);  //  http://localhost:8000/api/likes/like-recipe

//handling comments operations
import commentRouter from "./routes/comment.routes.mjs"
app.use("/api/comment",commentRouter);  //  http://localhost:8000/api/comment


//handle save recipe operations
import favRecipeRouter from "./routes/favRecipe.routes.mjs"
app.use("/api/fav-recipe",favRecipeRouter)   // http://localhost:8000/api/fav-recipe

//handle follow unfollow operations
import followerRouter from "./routes/followers.routes.mjs"
app.use("/api/follow-creater",followerRouter)  // http://localhost:8000/api/follow-creater

export { app };
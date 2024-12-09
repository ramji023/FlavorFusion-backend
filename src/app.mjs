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
app.use("/api/recipes",recipeRouter); //http://localhost:8000/api/recipes/

export { app };
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";


app.use(cors());
app.use(express.json({ limit: "16kb" }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.get("/test", (request,response)=>{
//     response.status(201).send({msg:"server is running now..."});
// })

import userRouter from "./routes/user.routes.mjs";
import bodyParser from "body-parser";
app.use("/api/users", userRouter);    // http://localhost:8000/api/users/register



export { app };
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(cors());
//use built in express middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}))



export { app };
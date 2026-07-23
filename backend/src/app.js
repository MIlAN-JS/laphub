import express from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js";


const app = express();
app.use(morgan("dev"))



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());




// routes 

app.use("/api/auth", userRouter);






export default app
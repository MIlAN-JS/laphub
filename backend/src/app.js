import express from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js";
import cors from "cors"

const app = express();
app.use(morgan("dev"))



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    origin : "http://localhost:5173", 
    credentials : true
}))


// routes 

app.use("/api/auth", userRouter);






export default app
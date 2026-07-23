import express from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js";


const app = express();
app.use(morgan("dev"))



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());




// routes 

app.use("/api/auth", authRouter);






export default app
import express from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import APIError from "./utility/apiError.js";
import errorHandler from "./middlewares/errHandler.middleware.js";


const app = express();
app.use(morgan("dev"))



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))
app.use(cookieParser());




// routes 
import authRouter from "./routes/auth.route.js";

app.use("/api/v1/auth", authRouter);

    app.get("/api/v1/error" , (req , res ,next)=>{
        try {

            const error = new APIError(400 , "Checking error", "CHECKING_ERROR")
           
            throw error
            
        } catch (error) {
            next(error)
        }
    })




app.use(errorHandler)

export default app
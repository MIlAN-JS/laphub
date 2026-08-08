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
import laptopRouter from "./routes/laptop.route.js";
import cartRouter from "./routes/cart.route.js";
import categoryRouter from "./routes/category.route.js";


app.use("/api/v1/auth", authRouter);
app.use("/api/auth", authRouter)
app.use("/api/v1/laptop", laptopRouter);
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/category", categoryRouter)





app.use(errorHandler)

export default app
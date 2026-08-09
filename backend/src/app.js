import express from "express";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import path from "path";
import { fileURLToPath } from "url";
import APIError from "./utility/apiError.js";
import errorHandler from "./middlewares/errHandler.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.join(__dirname, "../../frontend/dist");


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

// serve the built frontend
app.use(express.static(frontendDistPath));

// SPA fallback: any non-API GET goes to index.html so React Router can handle it
app.get("/*splat", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
});


app.use(errorHandler)

export default app
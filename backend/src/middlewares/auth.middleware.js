
import asyncHandler from "../utility/asyncHandler.js    "
import APIError from "../utility/apiError.js"
import jwt from "jsonwebtoken";
import config from "../config/config.js"
const verifyUser = asyncHandler(async(req , res ,next)=>{

    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")



    if(!accessToken){
      throw new APIError(401, "login properly")
    }

    const decoded = jwt.verify(accessToken , config.JWT_ACCESS_SECRET)

    req.userId = decoded.id

     next()

})
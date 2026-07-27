
import asyncHandler from "../utility/asyncHandler.js    "
import APIError from "../utility/apiError.js"
import jwt from "jsonwebtoken";
import config from "../config/config.js"


  const verifyUser = asyncHandler(async(req , res ,next)=>{

      const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    console.log(accessToken , "access token i s")

      if(!accessToken){
        throw new APIError(401, "token required " , "USER_NOT_FOUND")
      }

      const decoded = jwt.verify(accessToken , config.JWT_ACCESS_SECRET)

      req.userId = decoded.id

      next()

  })

export default verifyUser
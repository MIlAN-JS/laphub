import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import config from "../config/config.js"
import jwt from "jsonwebtoken"



const generateRefreshToken = (userId)=>{

   return  jwt.sign({
        id : userId
    } , config.JWT_REFRESH_SECRET , {expiresIn : "10d"});
    
}

const generateAccessToken = (userId)=>{
    
    return  jwt.sign({
        id : userId
    } , config.JWT_ACCESS_SECRET , {expiresIn : "10d"});

}

const registerUserService = async(userData)=>{
    try {

        if(!userData.email || !userData.password || !userData.fullName || !userData.contact){
            throw new Error("All fields are required")
        }

       const existingUser = await User.findOne({
        $or : [
            {email : userData.email},
            {contact : userData.contact}
        ]
       });

       if(existingUser){
        throw new Error("User already exists")
       }

       const newUser = await User.create({
           email : userData.email,
           password : userData.password,
           fullName : userData.fullName,
           contact : userData.contact ,
           role : userData.isSeller ? "seller" : "buyer"

       });

       const accessToken = generateAccessToken(newUser._id);
       const refreshToken = generateRefreshToken(newUser._id);

       
       return {
        newUser , accessToken , refreshToken
       }
    
        
    } catch (error) {

        throw new Error(error.message)
        
    }
}


const loginUserService = async({email , password})=>{
    try {

        const user = await User.findOne({email})
        console.log(user , "user data is ")

        if(!user){
            throw new Error("User with this email doesn't exist please try with another email")
        }

          const isMatch = await user.comparePassword(password);

            if (!isMatch) {
               throw new Error ("Invalid password")
            }


         const accessToken = generateAccessToken(user._id);
         const refreshToken = generateRefreshToken(user._id);

    
        return {
            user , 
            accessToken
        }



        
    } catch (error) {

        throw new Error(error.message)
        
    }
}




export { 
    registerUserService , 
    loginUserService
}
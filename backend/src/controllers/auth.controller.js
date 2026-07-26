import { registerUserService , loginUserService } from "../services/auth.service.js";
import APIError from "../utility/apiError.js";

import asyncHandler from "../utility/asyncHandler.js";
import uploadOnCloudinary from "../utility/cloudinary.js";
import User from "../models/auth-models/user.model.js";
import APIResponse from "../utility/apiResponse.js";

// const registerUserController = async(req , res , next) => {

//     try {

       

//         const {accessToken , refreshToken ,  newUser}  = await registerUserService(req.body);

//         //TODO : create refresh route and authenticate according to access token 
        
//         res.cookie("token" , refreshToken , {
//             httpOnly : true,
//             secure : false,
//             maxAge : 24 * 60 * 60 * 1000
//         });

//         res.status(201).json({
//             message : "User registered successfully",
//             accessToken,
//             user : newUser
//         })

    

       





        
        
        
//     } catch (error) {

//         res.status(400).json({
//             message : error.message
//         })
        
//     }
    
// }

const registerUserController = asyncHandler( async(req , res , next)=>{

        //get user data 

        const {email , password , role, username , contact} = req.body
         const localAvatarPath = req.file?.path

         console.log(req.body)


         const existedUser = await User.find({
            $or : [
                {email}, 
                {contact}
            ]
         })

         if(existedUser){
            throw new APIError(400 , "email already exists")
         }
    

        if(!localAvatarPath){
            throw new APIError(400 , "file upload null ")
        }

        //upload them to cloudinary

       const avatarRes = await uploadOnCloudinary(localAvatarPath)

       if(!avatarRes){
          throw new APIError(400 , "file upload null ")
       }

        //create a user in db 

        const newUser = await User.create({
             email, 
            password , 
            avatarRes, 
            role , 
            contact,
            username
        })


       if(!newUser._id){
            throw new APIError(500 , "cannot register user")
            
       }


     const userData = {
        email : newUser.email, 
        contact : newUser.contact, 
        username : newUser.username,
        avatar : newUser.avatar
     }


     return res.status(201).json(new APIResponse(200 , userData ,"user registered success" ))










        //remove pass and refreshtoken from response


        // check if user is created or not 


        // return response


        //if user is not created return error 

})


const registerSellerController = asyncHandler(async(req , res , next)=>{


    // check if user is registered 
    const userId = req.userId 

    // destructure all the data that came from frontend  

    const {storeName , storeNumber , businessType , businessAddress , panNumber , panImage ,   } = req.body


   



})






const loginUserController = async(req , res , next)=>{
    
    const {email , password} = req.body


    const {user ,accessToken , refreshToken } = await loginUserService({email , password});

     
     res.cookie("token" , refreshToken , {
            httpOnly : true,
            secure : false,
            maxAge : 24 * 60 * 60 * 1000
        });

    res.status(201).json({
        user, 
        success : true , 
        message : "login success yay!"
    })


}

export { 
    registerUserController, 
    loginUserController
}
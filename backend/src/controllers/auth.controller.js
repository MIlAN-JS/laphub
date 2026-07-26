import { registerUserService , loginUserService, generateAccessToken , generateRefreshToken } from "../services/auth.service.js";
import APIError from "../utility/apiError.js";
import asyncHandler from "../utility/asyncHandler.js";
import uploadOnCloudinary from "../utility/cloudinary.js";
import User from "../models/auth-models/user.model.js";
import APIResponse from "../utility/apiResponse.js";
import Seller from "../models/auth-models/seller.model.js";

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

        const {email , password , role, username} = req.body
        //  const localAvatarPath = req.file?.path

        console.log(req.body , "items are")

      


         const existedUser = await User.findOne({email})
         console.log(existedUser)

         if(existedUser){
            throw new APIError(409 , "email already exists" , "USER_ALREADY_EXISTS")
         }
    

        // if(!localAvatarPath){
        //     throw new APIError(400 , "file upload null " , "FILE_NOT_FOUND")
        // }

        //upload them to cloudinary

    //    const avatarRes = await uploadOnCloudinary(localAvatarPath)

    //    if(!avatarRes){
    //       throw new APIError(400 , "file upload null ")
    //    }

        //create a user in db 

        const newUser = await User.create({
             email, 
            password ,   
            role : role ? "buyer " : "seller", 
            username 
        })

         if(!newUser._id){
            throw new APIError(500 , "cannot register user", "SERVER_ERROR")
            
       }

        //generate store refresh token in cookie and in newUser obj

        const refreshToken = generateRefreshToken(newUser._id);

        res.cookie("refreshToken" , refreshToken, {
            httpOnly : true,
            secure : false,
            maxAge : 24 * 60 * 60 * 1000
        })
        newUser.refreshToken = refreshToken
        

        await newUser.save()

       

       const accessToken = generateAccessToken(newUser._id);



     const userData = {
        email : newUser.email, 
        contact : newUser.contact, 
        username : newUser.username,
        role : newUser.role
     }


     return res.status(201).json(new APIResponse(201 ,  {user : userData , accessToken   } ,"user registered success" ))




})


const registerSellerController = asyncHandler(async(req , res , next)=>{


    // check if user is registered 
    const userId = req.userId 

    // check if user exists with this userId 

    const existingUser = await User.findById(userId)

    if(!existingUser){
        const error = new APIError(401 , "user doesn't exist please register first ", "USER_NOT_FOUND")
        throw error
    }

    // destructure all the data that came from frontend  

    const {storeName , storeNumber , businessType , businessAddress , panNumber } = req.body
    const panImageLocalPath = req.file?.path


    //upload pan image to cloudinary

    const panImgUrl = await uploadOnCloudinary(panImageLocalPath)


    // create seller object

    const seller = await Seller.create({
        user : userId , 
        storeName , 
        storeNumber , 
        businessType , 
        businessAddress , 
        panNumber , 
        panImage : panImgUrl
    })
    

    if(!seller){

        throw new APIError(500 ,"cannot register seller")
        
    }

    await seller.populate({
    path: "user",
    select: "-password -refreshToken -panImage -panId",
        });


    // for now normal isVerified true but later we will do admin verification

    seller.isVerified  = true

    await seller.save()

    return res.status(200).json( new APIResponse(200 , seller , "seller registered successfully"))




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
    loginUserController, 
    registerSellerController
}
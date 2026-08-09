import {   generateAccessToken , generateRefreshToken } from "../services/auth.service.js";
import APIError from "../utility/apiError.js";
import asyncHandler from "../utility/asyncHandler.js";
import uploadOnCloudinary from "../utility/cloudinary.js";
import User from "../models/auth-models/user.model.js";
import APIResponse from "../utility/apiResponse.js";
import Seller from "../models/auth-models/seller.model.js";
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import Address from "../models/auth-models/address.model.js";
import sendEmail from "../services/email.service.js";
import { hashCodeHMAC, createVerificationCode, verifyCode } from "../utility/verificationCode.js";
import VerificationCode from "../models/auth-models/verificationCode.model.js";
import { findOrCreateUser } from "../services/auth.service.js";

// ## user(buyer) registration controller

const registerBuyerController = asyncHandler( async(req , res , next)=>{

        //get user data 

  

        const {email , password, username} = req.body

        console.log(req.body , "items are")

    
         const existingUser = await User.findOne({email}) || await Seller.findOne({email})



         if(existingUser){
            throw new APIError(409 , "email already exists" , "USER_ALREADY_EXISTS")
         }
    
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
            role : "buyer",
            username 
        })


         if(!newUser._id){
            throw new APIError(500 , "cannot register user", "SERVER_ERROR")
            
       }



           
           const {code , codeHash , expiresAt} = await createVerificationCode()

           console.log(code , codeHash , expiresAt)

         const verificationCode =  await VerificationCode.updateOne(
            { email },                                              // find by email
            { $set: { codeHash, expiresAt, attempts: 0, createdAt: new Date() } },
            { upsert: true }                                        // create if doesn't exist
          );
          if(!verificationCode){
            throw new APIError(500 , "cannot register user", "SERVER_ERROR")
          }
          else{
            const {data , error} = await sendEmail({
           email : email , 
           subject : "verification code",
           html : `<p>your verification code for laphub registration is  ${code}</p>`
       })

          }

          newUser.password = null 
          newUser.refreshToken = null
          newUser.panImage = null
          newUser.panId = null
           
       
     return res.status(201).json(new APIResponse(201 ,  {user : newUser} ,"user registered success please enter code to verify" ))




})


const resendVerificationCodeController = asyncHandler( async(req , res , next)=>{

    const {email} = req.body

    const existingUser = await User.findOne({email})

    if(!existingUser){
        throw new APIError(404 , "user not found" , "USER_NOT_FOUND")
    }

    const {code , codeHash , expiresAt} = await createVerificationCode()

    const verificationCode =  await VerificationCode.updateOne(
       { email },                                              // find by email
       { $set: { codeHash, expiresAt, attempts: 0, createdAt: new Date() } },
       { upsert: true }                                        // create if doesn't exist
     );

     if(!verificationCode){
       throw new APIError(500 , "cannot register user", "SERVER_ERROR")
     }
     else{
       const {data , error} = await sendEmail({
      email : "alexmagar262@gmail.com",
      subject : "verification code",
      html : `<p>your verification code for laphub registration is  ${code}</p>`
  })

     }
       
   
return res.status(201).json(new APIResponse(201 ,  {user : null} ,"resend code success" ))


})

const compareVerificationCodeController = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  let existingUser = await User.findOne({ email }) ;
  let accountType = "buyer"


  if(!existingUser){ 
    existingUser = await Seller.findOne({email});
    accountType = "seller"
  }

  if (!existingUser) {
    throw new APIError(404, "user not found", "USER_NOT_FOUND");
  }

  const verificationCode = await VerificationCode.findOne({ email });

  if (!verificationCode) {
    throw new APIError(404, "verification code not found", "VERIFICATION_CODE_NOT_FOUND");
  }

  if (new Date() > verificationCode.expiresAt) {
    await VerificationCode.deleteOne({ email });
    throw new APIError(400, "code expired", "CODE_EXPIRED");
  }

  if (verificationCode.attempts >= 5) {
    throw new APIError(429, "too many attempts, request a new code", "TOO_MANY_ATTEMPTS");
  }

  console.log(code , verificationCode.codeHash)

  const isCodeCorrect = await verifyCode({ submittedCode: code, storedHash: verificationCode.codeHash });

  if (!isCodeCorrect) {
    await VerificationCode.updateOne({ email }, { $inc: { attempts: 1 } });
    throw new APIError(401, "code incorrect", "CODE_INCORRECT");
  }

  //update the isVerified field 


  const updatedUser = accountType === "seller" ?  await Seller.updateOne({ email }, { $set: { isVerified: true } }) : await User.updateOne({ email }, { $set: { isVerified: true } })



  await VerificationCode.deleteOne({ email });

  const accessToken = generateAccessToken(existingUser._id);
  const refreshToken = generateRefreshToken(existingUser._id);

  existingUser.refreshToken = refreshToken;
  await existingUser.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  });

  existingUser.password = undefined;
  existingUser.refreshToken = undefined;
  existingUser.panImage = undefined;
  existingUser.panId = undefined;

  res.status(200).json(new APIResponse(200, { user : existingUser, accessToken : accessToken }, "user verified successfully"));


});


// ##. user (seller)  registration controller

const registerSellerController = asyncHandler(async(req , res , next)=>{




  const {email , password, storeName , storeNumber , businessType, businessAddress, panNumber ,country ,  state ,  city ,  street , postalCode } = req.body
    const panImageLocalPath = req.file?.path

 // check if seller exists 

 const existingSeller = await Seller.findOne({email : email}) || await User.findOne({email : email})

 if(existingSeller){
    throw new APIError(409 , "User with this email is already registered please login " , "USER_ALREADY_EXISTS")
 }


 const panImgUrl = await uploadOnCloudinary(panImageLocalPath)

 if(!panImgUrl){
    throw new APIError(500 , "cannot upload pan image to cloudinary" , "SERVER_ERROR")
 }

    const address = await Address.create({
        country , 
        state , 
        city , 
        street , 
        postalCode
    })

    const seller = await Seller.create({
        email , 
        password ,
        storeName , 
        storeNumber , 
        businessType , 
        businessAddress: address._id, 
        panNumber ,
        panImage : panImgUrl
    })

    if(!seller){
        throw new APIError(500 ,"cannot register seller")    
    }

    const {code , codeHash , expiresAt} = await createVerificationCode()
    
    const verificationCode = await VerificationCode.updateOne(
        { email },                                              // find by email
        { $set: { codeHash, expiresAt, attempts: 0, createdAt: new Date() } },
        { upsert: true }                                        // create if doesn't exist
      );
      if(!verificationCode){
        throw new APIError(500 , "cannot register user", "SERVER_ERROR")
      }
      else{
        const {data , error} = await sendEmail({
         email : "alexmagar262@gmail.com",
         subject : "verification code",
         html : `<p>your verification code for laphub registration is  ${code}</p>`
     })
 
        }
  
   



    seller.password = undefined
    seller.panImage = undefined
    seller.panId = undefined
    seller.refreshToken = undefined

    
    return res.status(200).json( new APIResponse(200 , {user : seller } , "seller registered successfully"))

})


//## user login controller
const loginUserController = async(req , res , next)=>{
    
    const {email , password} = req.body


    // check if user exists

    let user = await User.findOne({email}).populate("addresses")

    if(!user){
        user = await Seller.findOne({email}).populate("businessAddress")
    }

    if(!user){
        throw new APIError(401 , "user not found" , "USER_NOT_FOUND")
    }

    console.log(user , "user data while login is")

    // check if password is correct

    const isPasswordCorrect = await user.comparePassword(password) 

    if(!isPasswordCorrect){
        throw new APIError(401 , "password incorrect" , "PASSWORD_INCORRECT")
    }

    // generate access token and refresh token

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken
    await user.save()
     
     res.cookie("refreshToken" , refreshToken , {
            httpOnly : true,
            secure : false,
            maxAge : 24 * 60 * 60 * 1000
        });

        user.password = undefined;
        user.refreshToken = undefined;
        user.panImage = undefined;
        user.panId = undefined;
    res.status(200).json(new APIResponse(200 , {user  , accessToken} , "user logged in successfully"))


}

// ## refresh token controller
const refreshTokenController = asyncHandler(async(req , res , next)=>{

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        throw new APIError(401 , "token required " , "USER_NOT_FOUND")
    }

    const decoded = jwt.verify(refreshToken , config.JWT_REFRESH_SECRET)

    const userId = decoded.id

    const user = await User.findById(userId).populate("addresses").select("-password -refreshToken ") || await Seller.findById(userId).select("-password -refreshToken -panImage -panId").populate("businessAddress")

    if(!user){
        throw new APIError(401 , "user not found " , "USER_NOT_FOUND")
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken
    await user.save()


    res.cookie("refreshToken" , newRefreshToken , {
        httpOnly : true,
        secure : false,
        maxAge : 24 * 60 * 60 * 1000
    });


    res.status(200).json(new APIResponse(200 , {user , accessToken} , "token refreshed successs"))





})

// address setup controller 

const setupUserAddressController = asyncHandler(async(req , res , next)=>{

    // check whether user exists or not 

    const userId = req.userId

    if(!userId){
        throw new APIError(401 , "user not found " , "USER_NOT_FOUND")
    }

    const existingUser = await User.findById(userId)

    if(!existingUser){
        throw new APIError(401 , "user not found " , "USER_NOT_FOUND")
    }

    const {country , state, city , street , postalCode} = req.body

    const address = await Address.create({
        country , 
        state , 
        city , 
        street , 
        postalCode
    })

    await existingUser.addresses.push(address)
    await existingUser.save()

    return res.status(200).json(new APIResponse(200 , address , "address added successfully"))

})

 const googleCallbackController = async (req, res, next) => {

  try {

    console.log("inside callback google")

   const userData = req.user

   

  if (!userData) {
    return res.redirect(`${process.env.CLIENT_URL}/login` || `${process.env.DEV_FRONTEND_URL}/login`);
  }

  const user = await findOrCreateUser(userData , "google");
  console.log(user)

 
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save();
      
        
        res.cookie("refreshToken", refreshToken)

  
  // return res.redirect(`${process.env.CLIENT_URL}/dashboard` || `${process.env.DEV_FRONTEND_URL}/dashboard`); // changed from login to your route


  return res.redirect ("https://laphub-brxo.onrender.com")
    
  } catch (error) {

    console.log(error)
    next(error)
    
  }


};
 const facebookCallbackController = async (req, res, next) => {

  try {

    console.log("inside callback facebook")

   const userData = req.user

   

  if (!userData) {
    return res.redirect(`${process.env.CLIENT_URL}/login` || `${process.env.DEV_FRONTEND_URL}/login`);
  }

  const user = await findOrCreateUser(userData , "facebook");
  console.log(user)

 
     const refreshToken =  generateRefreshToken(user._id)
 res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // 🔥 set true in production (HTTPS)
    sameSite: "lax",
  });

  
  // return res.redirect(`${process.env.CLIENT_URL}/dashboard` || `${process.env.DEV_FRONTEND_URL}/dashboard`); // changed from login to your route


  return res.redirect (process.env.DEV_FRONTEND_URL)
    
  } catch (error) {

    console.log(error)
    next(error)
    
  }
};

const logoutUserController = asyncHandler(async(req , res , next)=>{

    res.clearCookie("refreshToken")
    res.status(200).json(new APIResponse(200 , {} , "user logged out successfully"))

})


export { 
    registerBuyerController, 
    loginUserController, 
    registerSellerController, 
    refreshTokenController, 
    setupUserAddressController,
    resendVerificationCodeController, 
    compareVerificationCodeController, 
    googleCallbackController,
    facebookCallbackController, 
    logoutUserController
}
import User from "../models/auth-models/user.model.js"
import bcrypt from "bcrypt"
import config from "../config/config.js"
import jwt from "jsonwebtoken"
import Seller from "../models/auth-models/seller.model.js"



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

 const findOrCreateUser = async (userData, provider) => {

    const { id, displayName, name, emails, photos } = userData;

    console.log(userData,provider)
  
    const email = emails?.[0]?.value;



   

    const userName = name
      ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
      : displayName;


  
    const query = [
      { googleId: id },
      { facebookId: id },
    ]

    if (email) query.push({ email })

   
    const user = await User.findOne({ $or: query }) || await Seller.findOne({ $or : query })

    console.log(user , "oauth user")
    if (user) {
      return user
    }

    // create new user
    const newUser = await User.create({
      username : userName
    ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
    : displayName,

    //   avatar:{
    //     url : photos?.[0]?.value,
    //     fileId : null
    //   } ,
      ...(email && { email }),
      ...(provider === 'google' && { googleId: id , provider : 'google' }), // haha it works like when provider is google then only googleId field will be added to the user document and when provider is github then only githubId field will be added to the user document because ...true will add the object here and ...false will not add the object here
      ...(provider === 'facebook' && { facebookId: id , provider : 'facebook' }),
isVerified : true
    })
    

    return newUser
  }







export { 
  
generateAccessToken ,
 generateRefreshToken, 
 findOrCreateUser
}
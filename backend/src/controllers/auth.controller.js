import { registerUserService , loginUserService } from "../services/auth.service.js";

import { asyncHandler } from "../utility/asyncHandler.js";

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

        const {email , password , role, fullName , contact} = req.body

        //validate all the data 

        // check if user exists 

        // check for files

        //upload them to cloudinary

        //create a user in db 


        //remove pass and refreshtoken from response


        // check if user is created or not 


        // return response


        //if user is not created return error 

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
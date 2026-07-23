import { registerUserService , loginUserService } from "../services/auth.service.js";

const registerUserController = async(req , res , next) => {

    try {

        const {accessToken , refreshToken ,  newUser}  = await registerUserService(req.body);

        //TODO : create refresh route and authenticate according to access token 
        
        res.cookie("token" , refreshToken , {
            httpOnly : true,
            secure : false,
            maxAge : 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message : "User registered successfully",
            accessToken,
            user : newUser
        })



        
        
        
    } catch (error) {

        res.status(400).json({
            message : error.message
        })
        
    }
    
}


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
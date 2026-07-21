import {body , validationResult } from "express-validator"



const validateResult =  (req , res , next)=>{

    const errors = validationResult(req),
   if(!errors.isEmpty()){
    return res.status(400).json({
        errors : errors.array()
    })
   }

   next()

}
 



const validateRegisterUser = [
    body("email")
       .isEmail()
       .withMessage("Invalid email"), 

    body("contact")
  .notEmpty()
  .withMessage("Contact is required")
  .isLength({ min: 10, max: 10 })
  .withMessage("Contact must be exactly 10 digits")
  .isNumeric()
  .withMessage("Contact must contain only numbers"),
      
validateResult
    
]

export {
    validateRegisterUser
}
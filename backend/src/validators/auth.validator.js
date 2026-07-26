import {body , validationResult } from "express-validator"



const validateResult =  (req , res , next)=>{

    const errors = validationResult(req);

   if (!errors.isEmpty()){

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

  body("password")
  .isLength({min : 6})
  .withMessage("password length is too small "),
validateResult
    
]


const validateLoginUser = [
    body("email")
    .isEmail()
    .withMessage("Please Enter valid Email"),
   validateResult
]


const validateSellerRegistration = [
    body("storeName")
    .trim()
    .notEmpty()
    .withMessage("Store name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Store name must be between 3 and 50 characters"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("businessType")
    .notEmpty()
    .withMessage("Business type is required")
    .isIn(["individual", "company"])
    .withMessage("Business type must be either 'individual' or 'company'"),

  body("governmentId")
    .isLength({ min: 9, max: 9 })
    .withMessage("PAN must be 9 digits")
    .isNumeric()
    .withMessage("PAN must contain only numbers"),

  body("businessAddress")
    .notEmpty()
    .withMessage("Business address is required")
    .isMongoId()
    .withMessage("Invalid address id"),

    validateResult


    
]

export {
    validateRegisterUser, 
    validateLoginUser, 
    validateSellerRegistration
}
import { param , body , validationResult } from "express-validator";


const validateRequest = (req , res , next)=>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors : errors.array()
        })
    }

    next()

}


const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid product id"),
    param("variantId").isMongoId().withMessage("Invalid variant id"),
    body("quantity").isNumeric().withMessage("Invalid quantity"),
    validateRequest
]

const validateDeleteCartItem = [
    param("itemId").isMongoId().withMessage("Invalid item id"),
    validateRequest
]


export {
    validateAddToCart,
    validateDeleteCartItem
}
import asyncHandler from "../utility/asyncHandler.js"
import laptopModel from "../models/laptop-models/laptop.model.js"
import LaptopVariant from "../models/laptop-models/laptopVariants.model.js"
import Cart from "../models/cart.model.js"
import { stockOfLaptopVariant } from "../dao/product.dao.js"
import APIResponse from "../utility/apiResponse.js"


const addToCartController = asyncHandler(async(req , res , next)=>{

    const userId = req.userId
    const {productId , variantId } = req.params

    const {quantity} = req.body

    const variant = await LaptopVariant.findOne({
        _id : variantId, 
        product : productId, 
        status : "active"
    })

    if(!variant){
        const error = new APIError(404 , "variant not found" , "VARIANT_NOT_FOUND")
        throw error
    }

    if(variant.stock < quantity){
        const error = new APIError(400 , "variant out of stock" , "VARIANT_OUT_OF_STOCK")
        throw error
    }


    const cart = (await Cart.findOne({
        userId : req.userId
    })) ||(await Cart.create({
        userId : req.userId, 
    }))


   
    //checking if the product is already in the cart

    const isProductInCart = await cart.productVariant.some((product)=>product.variantId.toString() === variantId)

    let updatedCart = cart
    
  if(isProductInCart){

    const stock = await stockOfLaptopVariant(productId , variantId)

    const quantityInCart = cart.productVariant.find((productVariant)=>productVariant.variantId.toString() === variantId).quantity


    if(stock < quantityInCart + quantity){
        const error = new APIError(400 , "variant out of stock" , "VARIANT_OUT_OF_STOCK")
        throw error
    }

     updatedCart = await Cart.findOneAndUpdate(
        {userId : userId , "productVariant.variantId"  : variantId  }, 
        {
            $inc : {
                "productVariant.$.quantity" : quantity
            }
        }, 
        {
            new : true
        }


    )
    


  }


  res.status(201).json(APIResponse(201 , {cart: updatedCart} , "product added to cart successfully"))



    
})

export {
    addToCartController
}
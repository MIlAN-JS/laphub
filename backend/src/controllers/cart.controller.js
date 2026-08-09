import mongoose from "mongoose"
import asyncHandler from "../utility/asyncHandler.js"
import LaptopVariant from "../models/laptop-models/laptopVariants.model.js"
import Cart from "../models/cart.model.js"
import APIResponse from "../utility/apiResponse.js"
import APIError from "../utility/apiError.js"




const addToCartController = asyncHandler(async(req , res , next)=>{

    const userId = req.userId
    const {productId , variantId } = req.params
    const quantity = Number(req.body.quantity)

    if(!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(variantId)){
        throw new APIError(400 , "invalid product or variant id" , "INVALID_ID")
    }

    if(!Number.isInteger(quantity) || quantity <= 0){
        throw new APIError(400 , "quantity must be a positive integer" , "INVALID_QUANTITY")
    }

    // check whether the variant exists or not and if it is of same product or not

    const variant = await LaptopVariant.findOne({
        _id : variantId,
        product : productId,
        status : "active"
    })

    if(!variant){
        throw new APIError(404 , "variant not found" , "VARIANT_NOT_FOUND")
    }

    let cart = await Cart.findOne({ user : userId })

    if(!cart){
        cart = await Cart.create({ user : userId, items: [] })
    }

    const existingItem = cart.items.find((item)=>item.variantId.toString() === variantId)
    const desiredQuantity = (existingItem?.quantity || 0) + quantity

    if(variant.stock < desiredQuantity){
        throw new APIError(400 , "variant out of stock" , "VARIANT_OUT_OF_STOCK")
    }

    if(existingItem){
        existingItem.quantity = desiredQuantity
    }else{
        cart.items.push({
            productId,
            variantId,
            price : variant.price,
            quantity,
        })
    }

    await cart.save()

    const statusCode = existingItem ? 200 : 201

    res.status(statusCode).json(
        APIResponse(statusCode, { cart }, existingItem ? "Cart updated successfully" : "Product added to cart successfully")
    )

})

const getCartController = asyncHandler(async(req , res , next)=>{

    const userId = req.userId


    const cart = await Cart.findOne({ user : userId }).populate("items.variantId")

    if(!cart){
        throw new APIError(404 , "Your cart is empty !!" , "CART_NOT_FOUND")
    }

    res.status(200).json(APIResponse(200 , {cart} , "cart fetched successfully"))

})




export {
    addToCartController, 
    getCartController
}

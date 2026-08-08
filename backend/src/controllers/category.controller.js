import Category from "../models/category.model.js";
import asyncHandler from "../utility/asyncHandler.js";
import APIResponse from "../utility/apiResponse.js";








const createCategoryController = asyncHandler(async(req , res , next)=>{

    const {name , slug , description , parent , status} = req.body

    const category = await Category.create({
        name ,
        slug ,
        description ,
        parent ,
        status
    })

    res.status(201).json(new APIResponse(201 , category , "category created successfully"))

})


const getCategoryController = asyncHandler(async(req , res , next)=>{

    const category = await Category.find({status: "active"})

    if(!category){
        const error = new APIError(404 , "category not found" , "CATEGORY_NOT_FOUND")
        throw error 
    }

    res.status(200).json(new APIResponse(200 , category , "category found successfully"))
})


export {
    createCategoryController, 
    getCategoryController
}
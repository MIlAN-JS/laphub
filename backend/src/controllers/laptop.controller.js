import laptopModel from "../models/laptop-models/laptop.model.js";
import uploadOnCloudinary from "../utility/cloudinary.js";
import LaptopVariant from "../models/laptop-models/laptopVariants.model.js";
import APIResponse from "../utility/apiResponse.js";
import asyncHandler from "../utility/asyncHandler.js";
import APIError from "../utility/apiError.js";
import Seller from "../models/auth-models/seller.model.js";



const createLaptopProductController = asyncHandler(async(req , res , next)=>{

    // check if user is registered as a seller
    const userId = req.userId

    const existingSeller = await Seller.findOne({ user : userId})
    console.log(existingSeller)

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }


    const {title , description, brand, battery, display } = req.body

    const variants = JSON.parse(req.body.variants)

    // fetching product  thumbnail from req.files

    const thumbnailPath = req.files.thumbnail[0].path


    //fetching variant images from req.files

    const variantImages = req.files.variantImage
    // console.log(variantImages , "variant images are : ")



    //uploading thumbnail to cloudinary

    const thumbnailUrl = await uploadOnCloudinary(thumbnailPath)

    // creating a new product 

    const newProduct = await laptopModel.create({
        title , description , brand , battery , display , thumbnail : thumbnailUrl , seller : existingSeller._id
    })

    

    // creating variants for the product

    let fetchedImages = 0 
    const newVariants = await Promise.all(
        variants.map(async(variant)=>{
            
            const {color , ram , storage , price , compareAtPrice , stock , sku , isDefaultVariant, imageCount} 
            = variant

            // fetch images only of relative variant using slice method 
            // console.log(variantImages , "before slicing")
            const variantImgs = variantImages.slice(fetchedImages, imageCount + fetchedImages);
            fetchedImages = fetchedImages + imageCount;


            // upload all the fetched image of the variant to cloudinary 


            const imageUrls = await Promise.all(
                variantImgs.map(async(image)=>{
                    console.log( "image is" , image  )
                    const imageUrl = await uploadOnCloudinary(image.path)
                    return imageUrl
                })
            )

            console.log(fetchedImages , imageUrls )


            console.log(imageUrls , "image Urls are")
            // creating a new variant for the product

            const newVariant = await LaptopVariant.create({
                product : newProduct._id,
                color,
                ram,
                storage,
                price,
                compareAtPrice,
                stock,
                sku,
                isDefaultVariant,
                images : imageUrls
            })

            return newVariant





            
        })
    )


    
    res.status(201).json(new APIResponse(201 , {product : newProduct , variants: newVariants} , "new product created successfully"))


  

   
})

const getSellerLaptopsController = asyncHandler(async(req , res , next)=>{
// get userID
    const userId = req.userId


    // check if user is registered as a seller
    const existingSeller = await Seller.findOne({ user : userId})

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

   

    const laptops = await laptopModel.aggregate([
        {
            $match : {
                seller : existingSeller._id
            }
        }, 

        {
            $lookup: {
                from : "laptopvariants",
                localField : "_id", 
                foreignField : "product", 
                as : "variants"
            }
        }
    ])

    console.log(laptops)

    res.status(200).json(new APIResponse(200 , laptops , "laptops fetched successfully"))


})


const getLaptopByIdController = asyncHandler(async(req , res , next)=>{

    const {laptopId} = req.params
    const userId = req.userId
    // seller exists ? 
    const existingSeller = await Seller.findOne({ user : userId})

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

    const laptop = await laptopModel.aggregate([
        {
            $match : {
                _id : existingSeller._id
            }
        } , 

        {
            $lookup : {
                from : "laptopvariants", 
                localField : "_id",
                foreignField : "product", 
                as : "variants"
            }
        }
    ]) 

    if(!laptop){
        const error = new APIError(404 , "laptop not found" , "LAPTOP_NOT_FOUND")
        throw error
    }

    res.status(200).json(new APIResponse(200 , laptop , "laptop fetched successfully"))

})







export {
    createLaptopProductController, 
    getSellerLaptopsController
}
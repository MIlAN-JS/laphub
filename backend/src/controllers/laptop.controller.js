import laptopModel from "../models/laptop-models/laptop.model.js";
import uploadOnCloudinary from "../utility/cloudinary.js";
import LaptopVariant from "../models/laptop-models/laptopVariants.model.js";
import APIResponse from "../utility/apiResponse.js";
import asyncHandler from "../utility/asyncHandler.js";


const createLaptopProductController = asyncHandler(async(req , res , next)=>{

    // check if user is registered 
    const userId = req.userId

    const {title , description , brand , battery , ram , processor , storage , price , display, variants } = req.body



    const thumbnail = req.file?.path

    if(!thumbnail){
        const error = new APIError(401 , "thumbnail is required " , "THUMBNAIL_REQUIRED")
        throw error
    }
   
    // check if seller exists with this userId

    const seller = await Seller.findOne({user : userId})

    if(!seller){
        const error = new APIError(401 , "user is not a seller " , "UNAUTHORIZED_ACCESS")
        throw error
    }

     const thumbnailUrl = await uploadOnCloudinary(thumbnail)


    const newLaptop = await laptopModel.create({
        title , description , brand , battery , display, thumbnail: thumbnailUrl  , seller: seller._id
    })

    if(!newLaptop){
        const error = new APIError(400 , "Server Error Laptop cannot created " , "LAPTOP_NOT_CREATED")
        throw error

    }


    const newVariants = await Promise.all(

        variants.map(async(variant)=>{
            // upload image to cloudinary
            const imageUrls = await uploadOnCloudinary(variant.image)




            // create document 

            return LaptopVariant.create({
                product: newLaptop._id,
                color: variant.color,
                ram: variant.ram,
                storage: variant.storage,
                processor: variant.processor,
                price: variant.price,
                compareAtPrice: variant.compareAtPrice,
                stock: variant.stock,
                sku: variant.sku,
                isDefaultVariant: variant.isDefault,
                images: imageUrls,
            })




        })

       
    )


    res.status(201).json(new APIResponse(201 , {product : newLaptop , variants: newVariants} , "new product created successfully"))


   
})



export {
    createLaptopProductController
}
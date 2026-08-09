import mongoose from "mongoose";
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

    const existingSeller = await Seller.findById(userId)
    console.log(existingSeller)

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }


    const {title , description, brand, battery, display , categoryId } = req.body

    const variants = JSON.parse(req.body.variants)

    // fetching product  thumbnail from req.files

    const thumbnailPath = req.files.thumbnail[0].path


    //fetching variant images from req.files

    const variantImages = req.files.variantImage
    // console.log(variantImages , "variant images are : ")



    //uploading thumbnail to cloudinary

    const thumbnailUrl = await uploadOnCloudinary(thumbnailPath)

    // getting categoryId 







    const newProduct = await laptopModel.create({
        title , description , brand , battery , display , thumbnail : thumbnailUrl , seller : existingSeller._id, 
        category : categoryId
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
    const existingSeller = await Seller.findById(userId)    

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

   

    const laptops = await laptopModel.aggregate([
        {
            $match : {
                seller : existingSeller._id, 
                status : "active"
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

    if(!mongoose.isValidObjectId(laptopId)){
        const error = new APIError(400 , "invalid laptop id" , "INVALID_ID")
        throw error
    }

    const laptop = await laptopModel.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(laptopId)
            }
        } ,

        {
            $lookup : {
                from : "laptopvariants",
                localField : "_id",
                foreignField : "product",
                as : "variants"
            }
        },

        {
            $lookup : {
                from : "sellers",
                localField : "seller",
                foreignField : "_id",
                as : "sellerInfo"
            }
        },

        {
            $unwind : "$sellerInfo"
        },

        {
            $addFields : {
                sellerInfo : {
                    _id : "$sellerInfo._id",
                    storeName : "$sellerInfo.storeName",
                    storeNumber : "$sellerInfo.storeNumber"
                }
            }
        }
    ])

    if(!laptop.length){
        const error = new APIError(404 , "laptop not found" , "LAPTOP_NOT_FOUND")
        throw error
    }

    res.status(200).json(new APIResponse(200 , laptop , "laptop fetched successfully"))

})


const getAllLaptopsController = asyncHandler(async(req , res , next)=>{

    const {page =1, limit = 20} = req.query
    const skip = (page - 1) * limit

    const laptops = await laptopModel.aggregate([
        {
            $match : {
                status : "active"
            }
        },
        {
            $sort : { createdAt : -1 }
        },
        {
            $skip : Number(skip)
        },
        {
            $limit : Number(limit)
        },
        {
            $lookup : {
                from : "laptopvariants",
                localField : "_id",
                foreignField : "product",
                as : "variants"
            }
        }
    ])


    res.status(200).json(new APIResponse(200 , laptops , "laptops fetched successfully"))




})


const deleteLaptopController = asyncHandler(async(req , res , next)=>{
    // get userId
    const userId = req.userId

    // check if user is registered as a seller
    const existingSeller = await Seller.findOne({ user : userId})
    
    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

    const {laptopId} = req.params

    const laptop = await laptopModel.findById(laptopId)

    if(!laptop){
        const error = new APIError(404 , "laptop not found" , "LAPTOP_NOT_FOUND")
        throw error
    }

    // check if the laptop belongs to the seller
        
    laptop.status = "archived"
    await laptop.save()  


  // update all the variants of the laptop to archived
    await LaptopVariant.updateMany({product : laptopId} , {status : "archived"})
 
    
    res.status(200).json(new APIResponse(200 , null , "laptop deleted successfully"))
    



     
})



 const deleteLaptopVariantController = asyncHandler(async(req , res , next)=>{

            const userId = req.userId

            // check if user is registered as a seller
            const existingSeller = await Seller.findOne({ user : userId})

            
            if(!existingSeller){
                const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
                throw error
            }

            
            const {variantId} = req.params

            const variant = await LaptopVariant.findOne({
                _id : variantId ,
                status : "active",            
                })

                console.log(variant)
            
            if(!variant){
                const error = new APIError(404 , "variant not found" , "VARIANT_NOT_FOUND")
                throw error
            }

            // check if the variant belongs to the seller

            const laptop = await laptopModel.find({
                _id : variant.product,
                seller : existingSeller._id,
                status : "active"
            })


            if (!laptop){
                const error = new APIError(403 , "variant does not belong to the seller" , "FORBIDDEN_ACCESS")
                throw error
            }
        
                
            variant.status = "archived"
            await variant.save()

            res.status(200).json(new APIResponse(200 , null , "variant deleted successfully"))


        })



const updateLaptopController = asyncHandler(async(req , res , next)=>{

    // check if user is registered as a seller

    const userId = req.userId

    const existingSeller = await Seller.findOne({ user : userId})

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

    
    const {laptopId} = req.params


    // find the laptop by id and seller id

    const laptop = await laptopModel.findOne({
        _id : laptopId,
        seller : existingSeller._id,
        status : "active"
    })

    if(!laptop){
        const error = new APIError(404 , "laptop not found" , "LAPTOP_NOT_FOUND")
        throw error
    }

    //get updating data from req.body and filtering it

    const changedProduct = {}

    Object.keys(req.body).forEach((key)=>{
    if(req.body[key] !== undefined){
        changedProduct[key] = req.body[key];
    }
  });
    

    // upload thumbnail to cloudinary if exists
    const thumbnailPath = req.file?.path

    if(thumbnailPath){

      let thumbnailUrl = await uploadOnCloudinary(thumbnailPath)

        if(!thumbnailUrl){
            const error = new APIError(500 , "thumbnail upload failed" , "THUMBNAIL_UPLOAD_FAILED")
            throw error
        }

        laptop.thumbnail = thumbnailUrl
       await laptop.save()

    }


const updatedLaptop = await laptopModel.findByIdAndUpdate(laptopId , changedProduct, {new : true})





    res.status(200).json(new APIResponse(200 , {product : updatedLaptop} , "laptop updated successfully"))









})


const createVariantController = asyncHandler(async(req , res , next)=>{

    const userId = req.userId

    // check if user is registered as a seller
    const existingSeller = await Seller.findById(userId)

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

    const { laptopId } = req.params

    // check if the laptop belongs to the seller

    const laptop = await laptopModel.findOne({
        _id : laptopId,
        seller : existingSeller._id
    })

    if(!laptop){
        const error = new APIError(404 , "laptop not found" , "LAPTOP_NOT_FOUND")
        throw error
    }

    const { color , ram , storage , price , currency , compareAtPrice , stock , sku , isDefaultVariant } = req.body

    const variantImages = req.files?.variantImage || []

    if(!variantImages.length){
        const error = new APIError(400 , "at least one variant image is required" , "IMAGES_REQUIRED")
        throw error
    }

    const imageUrls = await Promise.all(
        variantImages.map((image)=> uploadOnCloudinary(image.path))
    )

    const shouldBeDefault = isDefaultVariant === true || isDefaultVariant === "true"

    if(shouldBeDefault){
        await LaptopVariant.updateMany({ product : laptopId } , { isDefaultVariant : false })
    }

    const newVariant = await LaptopVariant.create({
        product : laptopId,
        color,
        ram,
        storage,
        price : { price , currency },
        compareAtPrice : compareAtPrice || null,
        stock,
        sku,
        images : imageUrls,
        isDefaultVariant : shouldBeDefault
    })

    res.status(201).json(new APIResponse(201 , { variant : newVariant } , "variant added successfully"))

})


const updateVariantController = asyncHandler(async(req , res , next)=>{



    const userId= req.userId

    // check if user is registered as a seller
    const existingSeller = await Seller.findOne({ user : userId})

    if(!existingSeller){
        const error = new APIError(401 , "user is not registered as seller ", "UNAUTHORIZED_ACCESS")
        throw error
    }

    const variantId = req.params.variantId
    const laptopId = req.params.laptopId


    console.log("variantId", variantId)
    console.log("pid", laptopId)
    // check if this variant belongs to a seller 

   const variant = await LaptopVariant.findOne({
    _id : variantId,
    product : laptopId,
    status : "active"
   })

   if(!variant){
    const error = new APIError(404 , "variant not found" , "VARIANT_NOT_FOUND")
    throw error
   }

  // updaing variants if exists
   const changedVariantData = req.body

       const changedVariants = {};

       Object.keys(changedVariantData).forEach((key)=>{
            if(changedVariantData[key] !== undefined){
                changedVariants[key] = changedVariantData[key];
            }
        });


const variantImages = req.files?.variantImage || [];

const variantImagesUrls = await Promise.all(
    variantImages.map(file =>
        uploadOnCloudinary(file.path)
    )
);


const updatedVariant = await LaptopVariant.findOneAndUpdate(
    {
        _id: variantId,
        product: laptopId,
        status:"active"
    },
    {
        $set:{
            ...changedVariants,
            ...(variantImagesUrls.length > 0 && {
                images: variantImagesUrls
            })
        }
    },
    {
        new:true
    }
);


    res.status(200).json(new APIResponse(200 , {variants : updatedVariant} , "variant updated successfully"))
})
 

// escape user input before dropping it into a RegExp so a query like
// "a(" can't blow up the regex engine or match unintended patterns
function escapeRegex(text){
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const searchLaptopsController = asyncHandler(async(req , res , next)=>{

    const { q , brand , categoryId , page = 1 , limit = 20 } = req.query

    if(categoryId && !mongoose.isValidObjectId(categoryId)){
        const error = new APIError(400 , "invalid category id" , "INVALID_ID")
        throw error
    }

    const pageNumber = Math.max(1 , Number(page) || 1)
    const pageLimit = Math.min(50 , Math.max(1 , Number(limit) || 20))
    const skip = (pageNumber - 1) * pageLimit

    const match = { status : "active" }

    // free-text search box: match against title, brand or description
    if(q && q.trim()){
        const searchRegex = new RegExp(escapeRegex(q.trim()) , "i")
        match.$or = [
            { title : searchRegex },
            { brand : searchRegex },
            { description : searchRegex }
        ]
    }

    // exact brand filter (eg. brand chips/dropdown on the storefront)
    if(brand && brand.trim()){
        match.brand = new RegExp(`^${escapeRegex(brand.trim())}$` , "i")
    }

    if(categoryId){
        match.category = new mongoose.Types.ObjectId(categoryId)
    }

    const [laptops, [{ total } = { total : 0 }]] = await Promise.all([
        laptopModel.aggregate([
            { $match : match },
            { $sort : { createdAt : -1 } },
            { $skip : skip },
            { $limit : pageLimit },
            {
                $lookup : {
                    from : "laptopvariants",
                    localField : "_id",
                    foreignField : "product",
                    as : "variants"
                }
            }
        ]),
        laptopModel.aggregate([
            { $match : match },
            { $count : "total" }
        ])
    ])

    res.status(200).json(new APIResponse(200 , {
        laptops,
        pagination : {
            page : pageNumber,
            limit : pageLimit,
            total,
            totalPages : Math.ceil(total / pageLimit)
        }
    } , "laptops fetched successfully"))

})


export {
    createLaptopProductController,
    getSellerLaptopsController,
    getAllLaptopsController,
    deleteLaptopController ,
    deleteLaptopVariantController,
    updateLaptopController,
    updateVariantController,
    getLaptopByIdController,
    createVariantController,
    searchLaptopsController
}
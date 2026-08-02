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
                _id : existingSeller._id, 
                status : "active"
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


const getAllLaptopsController = asyncHandler(async(req , res , next)=>{

    const {page =1, limit = 20} = req.query
    const skip = (page - 1) * limit

    const laptops = await laptopModel.find({status : "active"}).skip(skip).limit(limit).populate("seller")


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


const updateVariantController = asyncHandler(async(req , res , next)=>{
  // updating variants if exists
    const changedVariants = JSON.parse(req.body.variants)
    const variantImages = req.files.variantImage
    let updatedVariants ;
    let fetchedImages = 0;

    if(changedVariants && changedVariants.length > 0){

    

      updatedVariants = await Promise.all(
        changedVariants.map(async(variant)=>{

             const imageCount = variant.imageCount || 0
            // fetch images only of relative variant using slice method
            const variantImgs = variantImages.slice(fetchedImages, imageCount + fetchedImages);
            fetchedImages = fetchedImages + imageCount;
            
            // upload all the fetched image of the variant to cloudinary
            const variantImagesUrls = await Promise.all(variantImgs.map(async(variantImg)=>{
                return await uploadOnCloudinary(variantImg.path)
            }))


            // update the variant in the database

            const updatedVariant = await LaptopVariant.findOneAndUpdate({
                product : laptopId,
                status : "active",
            }, {
                $set : {
                ...variant,
                ...(variantImagesUrls.length > 0 && {
                    images: variantImagesUrls
                }) 
                }
            })




            
            
            
           
        
        })
      )

    }
})


export {
    createLaptopProductController, 
    getSellerLaptopsController, 
    getAllLaptopsController,
    deleteLaptopController ,
    deleteLaptopVariantController,
    updateLaptopController
}
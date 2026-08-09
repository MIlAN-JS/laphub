import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { createLaptopProductController, createVariantController, deleteLaptopController, deleteLaptopVariantController, getAllLaptopsController, getLaptopByIdController, getSellerLaptopsController, searchLaptopsController, updateLaptopController, updateVariantController } from "../controllers/laptop.controller.js"
import { validateAddVariant, validateCreateProduct, validateProductVariant } from "../validators/laptop.validator.js"
import { upload } from "../middlewares/multer.middleware.js"

const laptopRouter = Router()




/**
 * @route /api/v1/laptop/create
 * @description create new laptop product and its variants
 * @access private & seller only
 */
laptopRouter.post("/create", verifyUser ,upload.fields([
        { name: 'thumbnail', maxCount: 1 },
       { name: 'variantImage', maxCount: 20 }
]) , validateCreateProduct, validateProductVariant,createLaptopProductController)

/**
 * @route /api/v1/laptop/get-seller-laptops
 * @description to get all the laptops of a seller
 * @access private & seller only
 */

laptopRouter.get("/get-seller-laptops", verifyUser ,getSellerLaptopsController)


/**
 * @route /api/v1/laptop/get-laptop/:laptopId
 * @description get single laptop details by laptopId
 * @access private 
 */
laptopRouter.get("/get-laptop/:laptopId", verifyUser ,getLaptopByIdController)
 

/**
 * @route /api/v1/get-all-laptop?page=1&limit=20
 * @description get all the laptops to show in homepage 
 * @access private 
 */
laptopRouter.get("/get-all-laptop", verifyUser , getAllLaptopsController)

/**
 * @route /api/v1/laptop/search?q=&brand=&categoryId=&page=1&limit=20
 * @description search laptops by free-text query, brand and/or category
 * @access private
 */

laptopRouter.get("/search", verifyUser , searchLaptopsController)

/**
 * @route /api/v1/delete/:laptopId
 * @description delete a single laptop with all of its variants
 * @access private & seller only
 */
laptopRouter.delete("/delete/:laptopId", verifyUser ,deleteLaptopController )


/**
 * @route /api/v1/delete-variant/:variantId
 * @description delete a single variant of a laptop
 * @access private & seller only
 */
laptopRouter.delete("/delete-variant/:variantId", verifyUser ,deleteLaptopVariantController )


/**
 * @route /api/v1/update-product/:productId
 * @description update a single product details( patch )
 * @access private & seller only
 */

laptopRouter.patch("/update-laptop/:laptopId", verifyUser, upload.single("thumbnail") , updateLaptopController )

/**
 * @route /api/v1/laptop/:laptopId/variants
 * @description add a new variant to an existing laptop product
 * @access private & seller only
 */

laptopRouter.post("/:laptopId/variants",
        verifyUser,
        upload.fields([
        { name : "variantImage" , maxCount : 5 }
]) , validateAddVariant, createVariantController)

/**
 * @route /api/v1/laptops/:laptopId/variants/:variantId
 * @description
 * @access
 */

laptopRouter.patch("/update-variant/:laptopId/variants/:variantId" ,
         verifyUser ,
         upload.fields([
        {name : "variantImage" , maxCount : 5}
]) , updateVariantController)



export default laptopRouter
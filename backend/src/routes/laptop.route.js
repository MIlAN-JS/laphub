import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { createLaptopProductController, getAllLaptopsController, getSellerLaptopsController } from "../controllers/laptop.controller.js"
import { validateCreateProduct, validateProductVariant } from "../validators/laptop.validator.js"
import { upload } from "../middlewares/multer.middleware.js"

const laptopRouter = Router()




/**
 * @route /api/v1/laptop/create
 * @description create new laptop product and its variants
 * @access private
 */
laptopRouter.post("/create", verifyUser ,upload.fields([
        { name: 'thumbnail', maxCount: 1 },
       { name: 'variantImage', maxCount: 20 }
]) , validateCreateProduct, validateProductVariant,createLaptopProductController)

/**
 * @route /api/v1/laptop/get-seller-laptops
 * @description to get all the laptops of a seller
 * @access private
 */

laptopRouter.get("/get-seller-laptops", verifyUser ,getSellerLaptopsController)


/**
 * @route /api/v1/laptop/get-laptop/:laptopId
 * @description get single laptop details by laptopId
 * @access private
 */
laptopRouter.get("/get-laptop/:laptopId", verifyUser ,getSellerLaptopsController)
 

/**
 * @route /api/v1/get-all-laptop?page=1&limit=20
 * @description get all the laptops to show in homepage 
 * @access private
 */
laptopRouter.get("/get-all-laptop", verifyUser , getAllLaptopsController)

export default laptopRouter
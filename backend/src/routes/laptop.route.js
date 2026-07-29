import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { createLaptopProductController } from "../controllers/laptop.controller.js"
import { validateCreateProduct, validateProductVariant } from "../validators/laptop.validator.js"
import { upload } from "../middlewares/multer.middleware.js"

const laptopRouter = Router()





laptopRouter.post("/create", verifyUser ,upload.fields([
        { name: 'thumbnail', maxCount: 1 },
       { name: 'variantImages', maxCount: 20 }
]) , validateCreateProduct, validateProductVariant,createLaptopProductController)




export default laptopRouter
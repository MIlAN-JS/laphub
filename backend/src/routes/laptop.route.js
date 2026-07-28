import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { createLaptopProductController } from "../controllers/laptop.controller.js"
import { validateCreateProduct, validateProductVariant } from "../validators/laptop.validator.js"

const laptopRouter = Router()





laptopRouter.post("/create", verifyUser ,validateCreateProduct, validateProductVariant,createLaptopProductController)




export default laptopRouter
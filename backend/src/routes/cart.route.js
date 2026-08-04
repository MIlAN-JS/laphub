import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { validateAddToCart } from "../validators/cart.validator.js"
import { addToCartController } from "../controllers/cart.controller.js"
const cartRouter = Router()


/**
 * @route 
 * @description 
 * @access 
 * @arguments  productId, variantId, quantity
 * 
 */
cartRouter.post("/add/:productId/:variantId " , verifyUser,validateAddToCart ,  addToCartController)


export default  cartRouter
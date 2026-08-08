import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { validateAddToCart } from "../validators/cart.validator.js"
import { addToCartController, getCartController } from "../controllers/cart.controller.js"
const cartRouter = Router()


/**
 * @route 
 * @description 
 * @access 
 * @arguments  productId, variantId, quantity
 * 
 */
cartRouter.post("/add/:productId/:variantId " , verifyUser,validateAddToCart ,  addToCartController)


/**
 * @route /api/v1/cart/get
 * @description get the cart of the authenticated user
 * @access private
 */
cartRouter.get("/get", verifyUser ,getCartController )

export default  cartRouter
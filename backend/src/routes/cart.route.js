import {Router} from "express"
import verifyUser from "../middlewares/auth.middleware.js"
import { validateAddToCart, validateDeleteCartItem } from "../validators/cart.validator.js"
import { addToCartController, getCartController, deleteItemFromCartController } from "../controllers/cart.controller.js"
const cartRouter = Router()


/**
 * @route 
 * @description 
 * @access 
 * @arguments  productId, variantId, quantity
 * 
 */
cartRouter.post("/add/:productId/:variantId" , verifyUser,validateAddToCart ,  addToCartController)


/**
 * @route /api/v1/cart/get
 * @description get the cart of the authenticated user
 * @access private
 */
cartRouter.get("/get", verifyUser ,getCartController )


/**
 * @route /api/v1/cart/remove/:itemId
 * @description remove an item (by its cart item id) from the authenticated user's cart
 * @access private
 * @arguments itemId
 */
cartRouter.delete("/remove/:itemId", verifyUser, validateDeleteCartItem, deleteItemFromCartController)

export default  cartRouter
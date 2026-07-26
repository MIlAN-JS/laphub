import Router from "express";
import { validateLoginUser, validateRegisterUser, validateSellerRegistration } from "../validators/auth.validator.js";
import { loginUserController, registerSellerController, registerUserController } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route /api/auth/register
 * @description new user registration
 * @access public
 */
authRouter.post("/register" ,upload.single("avatar") , registerUserController )


/**
 * @route /api/auth/login
 * @description old user re-access /login 
 * @access  public
 */
authRouter.post("/login",validateLoginUser , loginUserController )



/**
 * @route /api/v1/auth/register-seller
 * @description register a user as a seller 
 * @access private
 */

authRouter.post("/register-seller",verifyUser ,validateSellerRegistration , upload.single("panImage"),registerSellerController )







export default authRouter;
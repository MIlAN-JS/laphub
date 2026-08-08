import Router from "express";
import { validateLoginUser, validateRegisterUser, validateSellerRegistration } from "../validators/auth.validator.js";
import { compareVerificationCodeController, loginUserController, registerBuyerController, registerSellerController, resendVerificationCodeController, setupUserAddressController } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyUser from "../middlewares/auth.middleware.js";
import { refreshTokenController } from "../controllers/auth.controller.js";
import User from "../models/auth-models/user.model.js";

const authRouter = Router();

/**
 * @route /api/auth/register
 * @description new user(buyer) registration
 * @access public
 */
authRouter.post("/register" , registerBuyerController )


/**
 * @route /api/auth/login
 * @description old user re-access /login 
 * @access  public
 */
authRouter.post("/login", validateLoginUser , loginUserController )

/**
 * @route /api/v1/auth/register-seller
 * @description register a user as a seller 
 * @access private
 */
authRouter.post(
    "/register-seller",
      verifyUser ,
      upload.single("panImage"),
      validateSellerRegistration ,
      registerSellerController 
    )


/**
 * @route /api/v1/auth/refresh-token
 * @description creates a new access token based on refresh token 
 * @access 
 */

authRouter.post("/refresh-token" , refreshTokenController )


/**
 * @route /api/v1/auth/setup-address
 * @description setup user profile (address ... )
 * @access private 
 */

authRouter.post("/setup-address", verifyUser , setupUserAddressController)


/**
 * @route /resend-verification-code
 * @description resend the verification code for authenticaiton
 * @access public
 */

authRouter.post("/resend-verification-code" , resendVerificationCodeController)

    
/**
 * @route /verify-code
 * @description verification of auth code
 * @access public
 */
authRouter.post("/verify-code" , compareVerificationCodeController)

export default authRouter;
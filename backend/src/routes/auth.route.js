import Router from "express";
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validator.js";
import { loginUserController, registerUserController } from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * @route /api/auth/register
 * @description new user registration
 * @access public
 */
authRouter.post("/register", validateRegisterUser ,registerUserController )


/**
 * @route /api/auth/login
 * @description old user re-access /login 
 * @access  public
 */
authRouter.post("/login",validateLoginUser , loginUserController )









export default authRouter;
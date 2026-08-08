import {Router} from "express"

import { createCategoryController, getCategoryController } from "../controllers/category.controller.js"

const categoryRouter = Router()





categoryRouter.post("/create"  ,createCategoryController)

categoryRouter.get("/get-all" , getCategoryController )


export default categoryRouter
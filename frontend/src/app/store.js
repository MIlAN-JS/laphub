import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/context/auth.slice.js"
import laptopReducer from "../features/laptop/context/laptop.slice.js"
import cartReducer from "../features/cart/context/cart.slice.js"
import categoryReducer from "../features/categories/context/category.slice.js"

const store = configureStore({
    reducer : {
        auth : authReducer,
        laptop : laptopReducer,
        cart : cartReducer,
        category : categoryReducer

    }
})

export default store
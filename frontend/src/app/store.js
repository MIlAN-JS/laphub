import {configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/context/auth.slice.js"
import laptopReducer from "../features/laptop/context/laptop.slice.js"
import cartReducer from "../features/cart/context/cart.slice.js"

const store = configureStore({
    reducer : {
        auth : authReducer, 
        laptop : laptopReducer, 
        cart : cartReducer

    }
})

export default store
import { createSlice } from "@reduxjs/toolkit";
import { clearError } from "../../auth/context/auth.slice";



const initialState = {
    cartData : [],
    isLoading : false,
    error : null
}


const cartSlice = createSlice({
    name : "cart" , 
    initialState , 
    reducers : {
        cartStart : (state)=>{
            state.isLoading = true
            state.error = null
        },
        cartSuccess : (state , action)=>{
            state.cartData = action.payload
            state.isLoading = false
            state.error = null
        },
        cartFailure : (state , action)=>{
            state.cartData = []
            state.isLoading = false
            state.error = action.payload
        }, 
        clearError  : (state)=>{
            state.error = null
        }
    }
})

export const {cartStart , cartSuccess , cartFailure , clearError} = cartSlice.actions
export default cartSlice.reducer
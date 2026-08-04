import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    laptopData : [],
    sellerLaptops : [],
    variantData : {}, 
    isLoading : false,
    error : null
}


const laptopSlice = createSlice({
    name : "laptop" , 
    initialState , 
    reducers : {
        laptopStart : (state)=>{
            state.isLoading = true
            state.error = null
        },
        laptopSuccessSeller : (state , action)=>{
            state.sellerLaptops = action.payload
            state.isLoading = false
            state.error = null
        },

        laptopSuccess : (state , action)=>{
            state.laptopData = action.payload
            state.isLoading = false
            state.error = null
        },
        laptopFailure : (state , action)=>{
            state.laptopData = []
            state.isLoading = false
            state.error = action.payload
        }, 
        clearError : (state)=>{
            state.error = null
        }

    }

})



export const {laptopStart , laptopSuccess ,laptopSuccessSeller,  laptopFailure , clearError} = laptopSlice.actions
export default laptopSlice.reducer
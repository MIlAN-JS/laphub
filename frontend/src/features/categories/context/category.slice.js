import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    categoryData : [],
    isLoading : false,
    error : null
}


const categorySlice = createSlice({
    name : "category" , 
    initialState , 
    reducers : {
        categoryStart : (state)=>{
            state.isLoading = true
            state.error = null
        } , 
        categorySuccess : (state , action)=>{
            state.categoryData = action.payload
            state.isLoading = false
            state.error = null
        } , 
        categoryFailure : (state , action)=>{
            state.categoryData = []
            state.isLoading = false
            state.error = action.payload
        } , 
        clearError : (state)=>{
            state.error = null
        }
    }
})


export const {categoryStart , categorySuccess , categoryFailure , clearError} = categorySlice.actions
export default categorySlice.reducer
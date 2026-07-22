import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    user : null , 
    accessToken : null,
    isAuthenticated : false, 
    isLoading : false, 
    error : null 
}


//TODO : Handle error on the basis of error code sent by backend not status code 

/*for ex 
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
*/



const authSlice = createSlice ({

     name : "auth", 
     initialState , 
     reducers : {
        
        authStart : (state )=>{

            state.isLoading = true
            state.error = null

        }, 


        authSuccess : (state , action)=>{
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.isAuthenticated = true
            state.isLoading = false
            state.error = null
        }, 

        authFailure : (state , action)=>{
            state.isAuthenticated = false
            state.error = action.payload
            state.isLoading = false
            state.accessToken = null
        },
        clearError : (state)=>{
            state.error = null
        }


     }


})



export const {authStart , authSuccess , authFailure , clearError} = authSlice.actions
export default authSlice.reducer
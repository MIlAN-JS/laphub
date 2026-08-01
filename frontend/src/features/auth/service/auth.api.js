import axios from "axios"
import store from "../../../app/store"
import api from "../../../app/app.api.js"


const registerUser = async({username  , email , password , isSeller})=>{

     console.log("calling backend ")

      const response =  await api.post("/auth/register" , {username  , email , password , isSeller})
      return response.data
    
    
}

const loginUserService = async({email , password})=> {
    const response = await api.post("/auth/login", {email , password})
    return response.data
}

// later if required
// const getUserService = async()=>{
//     const response = await api.get("/get-me")
//     return response.data
// }

 const refreshToken = async()=> {
    const response = await api.post("/auth/refresh-token")
    return response.data
}



export {
    registerUser, 
    loginUserService, 
    refreshToken, 
}
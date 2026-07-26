import axios from "axios"


const api = axios.create({
    baseURL : "/api/v1/auth", 
    withCredentials : true
})



const registerUser = async({username  , email , password , isSeller})=>{

     console.log("calling backend ")

      const response =  await api.post("/register" , {username  , email , password , isSeller})
      return response.data
    
    
}

const loginUserService = async({email , password})=> {
    const response = await api.post("/login", {email , password})
    return response.data
}


export {
    registerUser, 
    loginUserService
}
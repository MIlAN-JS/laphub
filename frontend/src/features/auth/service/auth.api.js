import axios from "axios"


const api = axios.create({
    baseURL : "/api/auth", 
    withCredentials : true
})



const registerUser = async({fullName , contact , email , password , isSeller})=>{

     console.log("calling backend ")

      const response =  await api.post("/register" , {fullName , contact , email , password , isSeller})
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
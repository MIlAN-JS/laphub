import axios from "axios"


const api = axios.create({
    baseURL : "http://localhost:3000/api/auth", 
    withCredentials : true
})



const registerUser = async({fullName , contact , email , password , isSeller})=>{

     console.log("calling backend ")

      const response =  await api.post("/register" , {fullName , contact , email , password , isSeller})
      return response.data
    
    
}


export {
    registerUser
}
import axios from "axios"
import store from "../../../app/store"

const api = axios.create({
    baseURL : "/api/v1/auth", 
    withCredentials : true
})
api.interceptors.request.use((config) => {

    const token = store.getState().auth.accessToken;

   console.log("hello world")
    console.log(config)

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const registerUser = async({username  , email , password , isSeller})=>{

     console.log("calling backend ")

      const response =  await api.post("/register" , {username  , email , password , isSeller})
      return response.data
    
    
}

const loginUserService = async({email , password})=> {
    const response = await api.post("/login", {email , password})
    return response.data
}

 const refreshToken = async()=> {
    const response = await api.post("/refresh-token")
    return response.data
}
export const hello = async()=> {
    const response = await api.get("/hello")
    return response.data
}


export {
    registerUser, 
    loginUserService, 
    refreshToken
}
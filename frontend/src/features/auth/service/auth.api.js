import axios from "axios"
import store from "../../../app/store"
import api from "../../../app/app.api.js"


const registerBuyerUser = async({username  , email , password })=>{

     console.log("calling backend ")

      const response =  await api.post("/auth/register" , {username  , email , password })
      return response.data
    
    
}

const loginUserService = async({email , password})=> {
    const response = await api.post("/auth/login", {email , password})
    return response.data
}


const registerSellerService  = async({email , password, storeName , storeNumber , businessType, panNumber, panImage, country, state, city, street, postalCode})=>{
let form = new FormData();
form.append("email", email);
form.append("password", password);
form.append("storeName", storeName);
form.append("storeNumber", storeNumber);
form.append("businessType", businessType);
form.append("panNumber", panNumber);
form.append("panImage", panImage);
form.append("country", country);
form.append("state", state);
form.append("city", city);
form.append("street", street);
form.append("postalCode", postalCode);

const response = await api.post("/auth/register-seller" , form)

return response.data

}

 const refreshToken = async()=> {
    const response = await api.post("/auth/refresh-token")
    return response.data
}

const logoutUserService = async()=> {
    const response = await api.post("/auth/logout")
    return response.data
}


const verifyUserService = async({email , code})=> {
    const response = await api.post("/auth/verify-code" , {email , code})
    return response.data
}


export {
    registerBuyerUser ,
    loginUserService,
    registerSellerService,
    refreshToken,
    verifyUserService, 
    logoutUserService
}
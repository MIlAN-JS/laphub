import api from "../../../app/app.api.js";



const getCartService= async()=>{

    const response = await api.get(`/cart/get`);
    return response.data
}


export { 
    getCartService
}
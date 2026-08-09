import api from "../../../app/app.api.js";



const getCartService= async()=>{

    const response = await api.get(`/cart/get`);
    return response.data
}

const addToCartService = async(productId, variantId, quantity)=>{

    const response = await api.post(`/cart/add/${productId}/${variantId}`, { quantity });
    return response.data
}


export {
    getCartService,
    addToCartService
}
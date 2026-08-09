import api from "../../../app/app.api.js";




const  getAllCategoriesService = async()=> {
    const response = await api.get("/category/get-all");
    return response.data
}


export {
    getAllCategoriesService
} 



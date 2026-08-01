import api from "../../../app/app.api.js";



const formData = new FormData();


 const createLaptopProductService = async({})=>{

    formData.append()

    const response = await api.post("/laptop/create" ,formData )
 }
import api from "../../../app/app.api.js";



const formData = new FormData();


 const createLaptopProductService = async({title, description, battery, brand, display, thumbnail, variants, variantImage})=>{

    formData.append("title", title);
    formData.append("description", description);
    formData.append("battery", battery);
    formData.append("brand", brand);
    formData.append("display", display);
    formData.append("thumbnail", thumbnail);
    formData.append("variants", JSON.stringify(variants));
    const flatImages = variantImage.flat();

    flatImages.forEach((file) => {
        formData.append("variantImage", file);
    });

    console.log(formData)

    const response = await api.post("/laptop/create" , formData )


    return response.data.product


 }

 export {
   createLaptopProductService
 }
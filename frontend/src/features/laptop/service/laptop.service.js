import api from "../../../app/app.api.js";



 const createLaptopProductService = async({title, description, battery, brand, display, categoryId, thumbnail, variants, variantImage})=>{

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("battery", battery);
    formData.append("brand", brand);
    formData.append("display", display);
    formData.append("categoryId", categoryId);
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



  const getSellerLaptops = async()=>{
    const response = await api.get("/laptop/get-seller-laptops");
    return response.data
  }


  const getLaptopDetail = async(laptopId)=>{
    const response = await api.get(`/laptop/get-laptop/${laptopId}`);
    return response.data
  }

  const getAllLaptopsService = async({page , limit})=>{
    const response = await api.get(`/laptop/get-all-laptop?page=${page}&limit=${limit}`);
    return response.data
  }

  const addVariantService = async(laptopId, {color, ram, storage, price, compareAtPrice, stock, sku, isDefaultVariant, variantImage})=>{

    const formData = new FormData();

    formData.append("color", color);
    formData.append("ram", ram);
    formData.append("storage", storage);
    formData.append("price", price.price);
    formData.append("currency", price.currency);
    if(compareAtPrice !== "" && compareAtPrice !== null && compareAtPrice !== undefined){
      formData.append("compareAtPrice", compareAtPrice);
    }
    formData.append("stock", stock);
    formData.append("sku", sku);
    formData.append("isDefaultVariant", Boolean(isDefaultVariant));

    variantImage.forEach((file) => {
      formData.append("variantImage", file);
    });

    const response = await api.post(`/laptop/${laptopId}/variants`, formData)

    return response.data
  }

 export {
   createLaptopProductService,
   getSellerLaptops,
   getLaptopDetail,
   getAllLaptopsService,
   addVariantService
 }
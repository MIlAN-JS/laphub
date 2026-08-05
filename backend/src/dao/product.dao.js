import LaptopVariant from "../models/laptop-models/laptopVariants.model.js";


const stockOfLaptopVariant = async({productId , variantId}) => {

    const variant = await LaptopVariant.findOne({
        _id : variantId,
        product : productId
    })
    return variant.stock
    
}

export {
    stockOfLaptopVariant
}
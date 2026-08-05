import mongoose from "mongoose";
import priceSchema from "./laptop-models/price.schema.js";

const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }, 

    items: {

    type: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Laptop",
            required: true
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LaptopVariant",
            required: true
        },
        price: {
            type: priceSchema,
            required: true
        }, 
        quantity: {
            type: Number,
            required: true
        }
    }],
    
    
           }, 

}, {
    timestamps: true
})

const Cart = mongoose.model("Cart" , cartSchema)

export default Cart
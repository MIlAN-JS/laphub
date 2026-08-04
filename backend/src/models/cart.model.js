import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }, 
    productVariant: {
    type: [{
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
    required: true
}, 


}, {
    timestamps: true
})

const Cart = mongoose.model("Cart" , cartSchema)

export default Cart
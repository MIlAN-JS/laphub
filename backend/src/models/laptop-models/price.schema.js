import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({

    price : {
        type : Number,
        required : true,
        trim : true
    }, 

    currency : {
        type : String,
        enum : ["NPR", "USD", "EUR"],
        required : true
        
    },

}, {
    _id : false,
    _v : false
})


export default priceSchema
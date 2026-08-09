import mongoose from "mongoose";


const laptopSchema = new mongoose.Schema({
        title : {
            type : String,
            required : true,
            trim : true
        },
        seller : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Seller",
            required : true

        }, 
        description : {
            type : String,
            required : true,
            trim : true
        },
        brand : {
            type : String,
            required : true,
            trim : true
        }, 
    battery : {
        type : String,
        required : true,
        trim : true
    },
    display : {
        type : String,
        required : true,
        trim : true
    } , 
    thumbnail: {type : String, required : true}
    , 
   status: {
    type: String,
    enum: ["active", "draft", "archived"],
    default: "draft"
}, 
 category : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Category",
    required : true
}



    
} , {
    timestamps : true
})


const laptopModel = mongoose.model("Laptop" , laptopSchema)


export default laptopModel
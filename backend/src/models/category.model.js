import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({
        name : {
            type : String,
            required : true,
            trim : true,
            unique : true
        },
        slug : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            lowercase : true
        },
        description : {
            type : String,
            trim : true
        },
        parent : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Category",
            default : null
        },
        status : {
            type : String,
            enum : ["active", "inactive"],
            default : "active"
        }

} , {
    timestamps : true
})


const Category = mongoose.model("Category" , categorySchema)


export default Category

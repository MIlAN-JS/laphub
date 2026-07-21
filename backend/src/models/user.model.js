import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    }, 
    password : {
        type: String,
       min : [5, "Password must be at least 6 characters long"], 
    }, 
    role : {
        type: String,
        enum: ["buyer", "seller", ],
        default: "buyer"
    }, 
    fullName : {
        type: String,
        required: true
    }, 
    contact : {
        type: String, 
        required : true
    }


}, {timestamps: true});


const User = mongoose.model("User", userSchema);

export default User;


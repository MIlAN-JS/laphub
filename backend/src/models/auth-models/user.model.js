import mongoose from "mongoose";
import bcrypt from "bcrypt"
import Address from "./address.model.js";




export const userSchema = new mongoose.Schema({

    email : {
        type: String,
        required: true,
        unique: true, 
        
    }, 
    password : {
        type: String,
       min : [5, "Password must be at least 6 characters long"], 
    }, 
    role : {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }, 
    isAdmin : {
        type : Boolean,
        default : false
    }, 
    username : {
        type: String,
        required: true
    }, 
    contact : {
        type: String, 
    },
 
   addresses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  }],  
    isVerified :{
        type : Boolean,
        default : false
    },
    refreshToken : {
        type : String, 
    }
   

   


}, {timestamps: true});


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


    userSchema.methods.comparePassword = async function (password) {
        console.log(password , this.password)
    return await bcrypt.compare(password, this.password);
    };

const User = mongoose.model("User", userSchema);

export default User;


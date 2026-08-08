import mongoose from "mongoose";
import userSchema from "./user.model.js";

const sellerSchema = new mongoose.Schema(
  {
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
    username : {
        type: String,
        required: true
    }, 
    avatar : {
        type : String 
    } , 

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    storeNumber: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },

    businessAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    panNumber: {
      type: String,
      required: true,
    },

    panImage: {
      type: String, // Cloudinary/S3 URL
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: "",
    },
    
    
  },
  {
    timestamps: true,
  }
);

const Seller =  mongoose.model("Seller", sellerSchema);

export default Seller; 
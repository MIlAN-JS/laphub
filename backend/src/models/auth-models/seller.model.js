import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
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
    
    
  },
  {
    timestamps: true,
  }
);

const Seller =  mongoose.model("Seller", sellerSchema);

export default Seller; 
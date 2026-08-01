import mongoose from "mongoose";


const laptopVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laptop",
      required: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    ram: {
      type: String,
      required: true,
      trim: true,
    },

    storage: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    images: 
      [
        {
          type: String,
          required: true,
          trim: true,
        },
      ], 
    

    status: {
      type: String,
      enum: ["active", "out_of_stock", "archived"],
      default: "active",
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isDefaultVariant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const LaptopVariant = mongoose.model("LaptopVariant", laptopVariantSchema);

export default LaptopVariant;
import mongoose, { Schema } from "mongoose";
import User from "./user";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    categories: [
      {
        category: {
          type: String,
          required: true,
        },
        confidence: {
          type: Number,
          required: true,
        },
      },
    ],
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    isEditable: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

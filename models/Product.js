import { Schema, model, models } from "mongoose";

// The schema is the structure of the document, and the model is an object that is responsible for creating and reading documents from the underlying MongoDB database.
const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
});

// The Product model is exported so that it can be imported in other files
export const Product = models.Product || model("Product", ProductSchema);

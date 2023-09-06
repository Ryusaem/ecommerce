// - mongoose →lets you work with MongoDB more easily from your NextJS/JavaScript app.
//- model →  Allows you to create, read, update, and delete records from a specific MongoDB collection.
//- Schema →  It acts as a blueprint to define the structure of your data, specifying types and potentially validation rules or default values.
//- "models" →  is a function in Mongoose that lets you retrieve model instances you've already created.
import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    // category →  is a reference to another document in the database.
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    // properties →  is an object with key-value pairs. For example, { color: "red", size: "large" }.
    properties: { type: Object },
  },
  {
    // timestamps: true →  adds createdAt and updatedAt fields to your schema.
    timestamps: true,
  }
);

export const Product = models.Product || model("Product", ProductSchema);

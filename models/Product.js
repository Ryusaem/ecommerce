// - mongoose →lets you work with MongoDB more easily from your NextJS/JavaScript app.
//- model →  Allows you to create, read, update, and delete records from a specific MongoDB collection.
//- Schema →  It acts as a blueprint to define the structure of your data, specifying types and potentially validation rules or default values.
//- "models" →  is a function in Mongoose that lets you retrieve model instances you've already created.
import mongoose, { model, Schema, models } from "mongoose";

// GOAL: Create a model for the Product collection.
// A collection is a group of MongoDB documents. It is the equivalent of a table in a relational database.
// A document is a record in a MongoDB collection. It is the equivalent of a row in a relational database.

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],

    // category →  is a reference to another document in the database. In this case, it is a reference to a Category document. The ref option is what tells Mongoose which model to use during population.
    category: { type: mongoose.Types.ObjectId, ref: "Category" },

    // properties →  is an object with key-value pairs. For example, { color: "red", size: "large" }.
    properties: { type: Object },
  },
  {
    // timestamps: true →  adds createdAt and updatedAt fields to your schema.
    timestamps: true,
  }
);

// If the Product model is already registered, use it. Otherwise, create a new model.
export const Product = models.Product || model("Product", ProductSchema);

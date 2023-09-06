// - mongoose →lets you work with MongoDB more easily from your NextJS/JavaScript app.
//- model →  Allows you to create, read, update, and delete records from a specific MongoDB collection.
//- Schema →  It acts as a blueprint to define the structure of your data, specifying types and potentially validation rules or default values.
//- "models" →  is a function in Mongoose that lets you retrieve model instances you've already created.
import mongoose, { Schema, models, model } from "mongoose";

// Schema is usde to define the structure of the document.
const CategorySchema = new Schema({
  name: { type: String, required: true },
  // Types.ObjectId is a special type in Mongoose for storing MongoDB ObjectIds
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: [{ type: Object }],
});

// models contains all the models that have been registered with Mongoose.
export const Category = models?.Category || model("Category", CategorySchema);

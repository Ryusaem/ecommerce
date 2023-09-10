// - mongoose →lets you work with MongoDB more easily from your NextJS/JavaScript app.
//- model →  Allows you to create, read, update, and delete records from a specific MongoDB collection.
//- Schema →  It acts as a blueprint to define the structure of your data, specifying types and potentially validation rules or default values.
//- "models" →  is a function in Mongoose that lets you retrieve model instances you've already created.
import mongoose, { Schema, models, model } from "mongoose";

// GOAL: Create a model for the Category collection.
// A collection is a group of MongoDB documents. It is the equivalent of a table in a relational database.
// A document is a record in a MongoDB collection. It is the equivalent of a row in a relational database.

// Schema is used to define the structure of the document. A sort of blueprint for the document.
const CategorySchema = new Schema({
  name: { type: String, required: true },
  // Types.ObjectId is a special type in Mongoose for storing MongoDB ObjectIds.
  // Here it mean that the parent field will contain the _id of another Category document.
  // For example, if we have a Category document with _id = 1, and another Category document with _id = 2, we can set the parent field of the second Category document to 1.
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  // properties field will contain an array of objects. Each object will have a name and a value. For example, { name: "color", value: "red" }.
  properties: [{ type: Object }],
});

// models contains all the models that have been registered with Mongoose.
// If the Category model is already registered, use it. Otherwise, create a new model.
export const Category = models?.Category || model("Category", CategorySchema);

import mongoose, { Schema, models, model } from "mongoose";

// Schema is usde to define the structure of the document.
const CategorySchema = new Schema({
  name: { type: String, required: true },
  // Types.ObjectId is a special type in Mongoose for storing MongoDB ObjectIds
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
});

// models contains all the models that have been registered with Mongoose.
export const Category = models?.Category || model("Category", CategorySchema);

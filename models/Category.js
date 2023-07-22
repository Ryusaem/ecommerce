import { Schema, models, model } from "mongoose";

// Schema is usde to define the structure of the document.
const CategorySchema = new Schema({
  name: { type: String, required: true },
});

// models contains all the models that have been registered with Mongoose.
export const Category = models?.Category || model("Category", CategorySchema);

// - mongoose →lets you work with MongoDB more easily from your NextJS/JavaScript app.
//- model →  Allows you to create, read, update, and delete records from a specific MongoDB collection.
//- Schema →  It acts as a blueprint to define the structure of your data, specifying types and potentially validation rules or default values.
//- "models" →  is a function in Mongoose that lets you retrieve model instances you've already created.
const { Schema, model, models } = require("mongoose");

// GOAL: Create a model for the Order collection.
// A collection is a group of MongoDB documents. It is the equivalent of a table in a relational database.
// A document is a record in a MongoDB collection. It is the equivalent of a row in a relational database.

const OrderSchema = new Schema(
  {
    // line_items contain the products ordered and their quantities. line_items originates from Stripe.
    // For example, if a user orders 2 products, the line_items field will contain an array of 2 objects. Each object will have a product_id and a quantity.
    line_items: Object,
    name: String,
    city: String,
    email: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
  },
  {
    timestamps: true,
  }
);

// If the Order model is already registered, use it. Otherwise, create a new model.
export const Order = models?.Order || model("Order", OrderSchema);

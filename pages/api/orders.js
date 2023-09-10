// mongooseConnext is a function that connects to the database.
import { mongooseConnect } from "@/lib/mongoose";

// Order is a model that represents a collection in the database.
// a collection is a group of documents (like a table in SQL databases).
import { Order } from "@/models/Order";

// -------------------------------------------
// GOAL: Create an API route that returns a list of orders from the database.
// An API route is a special type of Next.js page, that is used for handling requests from the client. It is not a page that is rendered by Next.js. It is a page that is used for handling requests from the client.
// -------------------------------------------

// -------------------------------------------
// Algorithm:
// 0. The user sends a request to the API route (pages/api/orders.js). For example, the user wants to get a list of orders.
// 1. Connect to the database (using mongooseConnect).
// 2. Return a list of orders from the database (using Order.find()).
// -------------------------------------------

export default async function handler(req, res) {
  // connect to MongoDB by calling the mongooseConnect function
  await mongooseConnect();

  // Get all orders, sorted by createdAt descending (-1)
  res.json(await Order.find().sort({ createdAt: -1 }));
}

// mongooseConnext is a function that connects to the database.
import { mongooseConnect } from "@/lib/mongoose";

// Category is a model that represents a collection in the database.
// a collection is a group of documents (like a table in SQL databases).
import { Category } from "@/models/Category";

// isAdminRequest check if the user is an admin.
import { isAdminRequest } from "./auth/[...nextauth]";

// -------------------------------------------
// GOAL: Create an API route that returns a list of categories from the database.
// An API route is a special type of Next.js page, that is used for handling requests from the client. It is not a page that is rendered by Next.js. It is a page that is used for handling requests from the client.
// -------------------------------------------

// -------------------------------------------
// Algorithm:
// 0. The user sends a request to the API route (pages/api/categories.js). For example, the user wants to get a list of categories.
// 1. Connect to the database (using mongooseConnect).
// 2. Check if the user is an admin. (using isAdminRequest)
// 3. If the user is an admin we need to check the HTTP method of the request (GET, POST, PUT, DELETE, etc).
//    3.1  If the method is GET, return a list of categories from the database (using Category.find()).
//    3.2  If the method is POST, create a new category document in the database with the name provided (using Category.create()).
//    3.3  If the method is PUT, update the category with the id provided with the name and parentCategory provided (using Category.updateOne()).
//    3.4  If the method is DELETE, delete the category with the id provided (using Category.deleteOne()).
// 4. If the user is not an admin, return an error message.
// -------------------------------------------

// handle is a function that is used for handling requests from the client.
export default async function handle(req, res) {
  // method will contain the HTTP method of the request (GET, POST, PUT, DELETE, etc)
  const { method } = req;

  // Connect to the database.
  await mongooseConnect();

  // Check if the user is an admin.
  await isAdminRequest(req, res);

  // -------------------------------------------
  // ---- GET ----
  // If the method is GET, return a list of categories from the database.
  //find() is a function that returns a list of documents from the database.
  //populate("parent") is a function that returns the parent category of each category.
  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  // ---- POST ----
  // If the method is POST, create a new category document in the database with the name provided
  if (method === "POST") {
    // Get the "name", "partentCategory" and "properties" of the category from the request body.
    // The req.body contain the data sent by the client. Example: { name: "Electronics", parentCategory: "5f9b1b1b1b1b1b1b1b1b1b1b", properties: ["color", "size"] }
    const { name, parentCategory, properties } = req.body;

    // This is what actually talks to the database and creates a new category document. The Category.create() method comes from Mongoose, which is a tool to help interact with MongoDB. When you call this method, Mongoose will create a new document in the database based on the data you provided.
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });

    // res.json(categoryDoc) will return the category document that was created in the database
    // res.json() sends a JSON response to the client. It's used to return data to whoever made the request, such as a frontend application or another service.
    res.json(categoryDoc);
  }

  // ---- PUT ----
  // If the method is PUT, update the category with the id provided with the name, parentCategory and properties provided
  if (method === "PUT") {
    // req.body is the data sent by the client and we need to destructure it into name and parentCategory, and _id.
    // _id come from the query string. Example: /api/categories?_id=5f9b1b1b1b1b1b1b1b1b1b1b
    const { name, parentCategory, properties, _id } = req.body;

    // Update the category with the id provided with the name and parentCategory provided. The Category.updateOne() method comes from Mongoose, which is a tool to help interact with MongoDB. When you call this method, Mongoose will update the document in the database with the id you provided.
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );

    // res.json(categoryDoc) will return the category document that was updated in the database
    res.json(categoryDoc);
  }

  // ---- DELETE ----
  // If the method is DELETE, delete the category with the id provided.
  if (method === "DELETE") {
    // _id come from the query string. Example: /api/categories?_id=5f9b1b1b1b1b1b1b1b1b1b1b
    const { _id } = req.query;

    // Delete the category with the id provided. The Category.deleteOne() method comes from Mongoose, which is a tool to help interact with MongoDB. When you call this method, Mongoose will delete the document in the database with the id you provided.
    await Category.deleteOne({ _id });

    // res.json("ok") will return the string "ok" to the client.
    res.json("ok");
  }
}

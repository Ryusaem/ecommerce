// mongooseConnext is a function that connects to the database.
import { mongooseConnect } from "@/lib/mongoose";

// Product is a model that represents a collection in the database.
// a collection is a group of documents (like a table in SQL databases).
import { Product } from "@/models/Product";

// isAdminRequest check if the user is an admin.
import { isAdminRequest } from "./auth/[...nextauth]";

// -------------------------------------------
// GOAL: Create an API route that returns a list of products from the database.
// An API route is a special type of Next.js page, that is used for handling requests from the client. It is not a page that is rendered by Next.js. It is a page that is used for handling requests from the client.
// -------------------------------------------

// -------------------------------------------
// Algorithm:
// 0. The user sends a request to the API route (pages/api/products.js). For example, the user wants to get a list of products.
// 1. Connect to the database (using mongooseConnect).
// 2. Check if the user is an admin. (using isAdminRequest)
// 3. If the user is an admin we need to check the HTTP method of the request (GET, POST, PUT, DELETE, etc).
//    3.1  If the method is GET, return a list of products from the database (using Product.find()).
//    3.2  If the method is POST, create a new product document in the database with the title, description and price provided (using Product.create()).
//    3.3  If the method is PUT, update the product with the id provided with the title, description and price provided (using Product.updateOne()).
//    3.4  If the method is DELETE, delete the product with the id provided (using Product.deleteOne()).
// 4. If the user is not an admin, return an error message.
// -------------------------------------------

// handle is a function that is used for handling requests from the client.
export default async function handle(req, res) {
  // method will contain the HTTP method of the request (GET, POST, PUT, DELETE, etc)
  const { method } = req;

  // connect to MongoDB by calling the mongooseConnect function
  await mongooseConnect();

  // check if the user is an admin
  await isAdminRequest(req, res);

  // -------------------------------------------

  // ---- GET ----
  // If the method is GET, return a list of products from the database. (using Product.find()
  // If request possess an id, return the product with the given id (using Product.findOne()
  if (method === "GET") {
    // check if the query string contains an id parameter and if so, return the product with the given id from MongoDB by calling the findOne method of the Product model and passing the id as an argument to the query object. Example: /api/products?id=5f9b1b1b1b1b1b1b1b1b1b1b
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      // if the query string does not contain an id parameter, return all products from MongoDB by calling the find method of the Product model
      res.json(await Product.find());
    }
  }

  // ---- POST ----
  // If the method is POST, create a new product document in the database with the title, description, price, category and properties provided.
  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;

    // create a new product document in MongoDB by calling the create method of the Product model and passing the title, description and price as arguments.
    const ProductDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });

    // return the product document
    res.json(ProductDoc);
  }

  // ---- PUT ----
  // If the method is PUT, update the product with the id provided with the title, description, price, images, category and properties provided.
  if (method === "PUT") {
    // get the title, description, price and _id from the request body
    const { title, description, price, images, category, properties, _id } =
      req.body;

    // update the product with the given _id
    //updateOne is a Mongoose method that updates a document, the first argument is the query, the second argument is the update
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    );

    // return true
    res.json(true);
  }

  // ---- DELETE ----
  // If the method is DELETE, delete the product with the id provided.
  if (method === "DELETE") {
    // check if the query string contains an id parameter. Example: /api/products?id=5f9b1b1b1b1b1b1b1b1b1b1b
    if (req.query?.id) {
      // delete the product with the given id from MongoDB by calling the deleteOne method of the Product model and passing the id as an argument to the query object
      await Product.deleteOne({ _id: req.query.id });

      // return true
      res.json(true);
    }
  }
}

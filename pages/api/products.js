import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  // req.method is the HTTP method of the request
  // res.json(req.method);

  // same as req.method
  const { method } = req;

  // connect to MongoDB by calling the mongooseConnect function
  await mongooseConnect();

  if (method === "GET") {
    // check if the query string contains an id parameter and if so, return the product with the given id from MongoDB by calling the findOne method of the Product model and passing the id as an argument to the query object
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      // if the query string does not contain an id parameter, return all products from MongoDB by calling the find method of the Product model
      res.json(await Product.find());
    }
  }

  // check if the HTTP method is POST
  if (method === "POST") {
    const { title, description, price, images, category, properties } =
      req.body;

    // create a new product document in MongoDB by calling the create method of the Product model and passing the title, description and price as arguments
    const ProductDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(ProductDoc);
  }

  // check if the HTTP method is PUT
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
    res.json(true);
  }

  // check if the HTTP method is DELETE
  if (method === "DELETE") {
    // check if the query string contains an id parameter
    if (req.query?.id) {
      // delete the product with the given id from MongoDB by calling the deleteOne method of the Product model and passing the id as an argument to the query object
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}

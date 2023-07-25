import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    // Get the name of the category from the request body. It's like req.body.name
    const { name, parentCategory } = req.body;

    // Create a new category document in the database with the name provided
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    // req.body is the data sent by the client and we need to destructure it into name and parentCategory, and _id
    const { name, parentCategory, _id } = req.body;

    // Update the category with the id provided with the name and parentCategory provided
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}

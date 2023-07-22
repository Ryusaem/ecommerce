import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    // Get the name of the category from the request body. It's like req.body.name
    const { name } = req.body;

    // Create a new category document in the database with the name provided
    const categoryDoc = await Category.create({ name });
    res.json(categoryDoc);
  }
}

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
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price } = req.body;
    const ProductDoc = await Product.create({ title, description, price });
    res.json(ProductDoc);
  }

  if (method === "PUT") {
    const { title, description, price, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price });
    res.json(true);
  }
}

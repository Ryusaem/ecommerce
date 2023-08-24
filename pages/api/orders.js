import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();

  // Get all orders, sorted by createdAt descending (-1)
  res.json(await Order.find().sort({ createdAt: -1 }));
}

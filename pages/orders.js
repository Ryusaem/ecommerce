import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  // We'll use the useState hook to store the orders
  const [orders, setOrders] = useState([]);

  // We'll use the useEffect hook to fetch the orders from the API when the component loads.
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {/* We'll use the map method to iterate over the orders array and render a table row for each order. */}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr>
                {/* We'll use the toLocaleString method to format the date. */}
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? "text-green-600" : "text-red-600"}>
                  {order.paid ? "YES" : "NO"}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postalCode} {order.country}
                  <br />
                  {order.streetAddress}
                </td>
                <td>
                  {/* line_items contain the products ordered and their quantities. line_items originates from Stripe. */}
                  {order.line_items.map((line) => (
                    <>
                      {/* price_data is the product data we set in the Stripe
                      Dashboard. product_data is a Stripe object inside
                      price_data. */}
                      {line.price_data?.product_data.name} x {line.quantity}
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

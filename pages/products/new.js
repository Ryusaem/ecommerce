import Layout from "@/components/Layout";
// axios is a library to make HTTP requests
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function NewProduct() {
  // The state variables are used to store the form field values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  // The createProduct function is called when the form is submitted
  async function createProduct(ev) {
    // Prevent the browser from submitting the form
    ev.preventDefault();
    // data is an object with the form field names and values
    const data = { title, description, price };
    // Send a POST request to the API endpoint with the form data
    await axios.post("/api/products", data);
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New product</h1>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          // value is the state variable
          value={title}
          // ev.target.value is the value of the input field
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
        <label>Price in euro</label>
        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
        <button
          className="btn-primary"
          type="submit"
        >
          Save
        </button>
      </form>
    </Layout>
  );
}

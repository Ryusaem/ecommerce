import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

// GOAL: Create a page that allows us to edit a product

// Algorithm:
// 1. Create a page that uses the ProductForm component
// 2. Get the product info from the API and pass it to the ProductForm component as props
// 3. The ProductForm component will use the product info to populate the form
// 4. When the form is submitted, the ProductForm component will send the product info to the API to update the product
// 5. The API will update the product in the database and return the updated product info
// 6. The ProductForm component will redirect the user to the product page

// The edit product page is used to edit an existing product
export default function EditProductPage() {
  // productInfo is the state variable that will store the product info
  const [productInfo, setProductInfo] = useState(null);

  // get the router object from Next.js so we can access the URL parameters
  const router = useRouter();

  // get the id from the URL
  const { id } = router.query;

  // the useEffect hook is used to run code when the component is mounted (first time it is shown) and when the id changes (when the URL changes)
  useEffect(() => {
    // if there is no id, we don't need to do anything else so we return (exit the function)
    if (!id) {
      return;
    }

    // get the product info from the API and store it in the state variable productInfo
    axios.get("/api/products/?id=" + id).then((response) => {
      // response.data contain the product info (title, description, price) as an object
      setProductInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Product</h1>

      {/* productInfo is null when the page is first loaded, so we need to check if it is not null before we can use it */}
      {/* // when it's loaded, we pass the product info to the ProductForm component as props (title, description, price)  */}
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}

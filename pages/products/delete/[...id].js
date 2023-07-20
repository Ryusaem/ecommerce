import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  // router allow us to get the id from the url
  const router = useRouter();

  // productInfo will be the product we want to delete
  const [productInfo, setProductInfo] = useState();

  // get the id from the url
  const { id } = router.query;

  // if the id changes, we need to update the productInfo
  useEffect(() => {
    // if there is no id, we don't need to do anything
    if (!id) return;

    // get the product we want to delete
    axios.get("/api/products?id=" + id).then((response) => {
      // set the productInfo to the product we want to delete
      setProductInfo(response.data);
    });
  }, [id]);

  // goBack will take us back to the products page
  function goBack() {
    router.push("/products");
  }

  async function deleteProduct() {
    // get the id from the url and send it to the backend to delete it from the database
    await axios.delete("/api/products?id=" + id);

    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp;"{productInfo?.title}"
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          className="btn-red"
          onClick={deleteProduct}
        >
          Yes
        </button>
        <button
          className="btn-default"
          onClick={goBack}
        >
          No
        </button>
      </div>
    </Layout>
  );
}

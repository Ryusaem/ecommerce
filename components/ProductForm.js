import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  // The state variables are used to store the form field values
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  // The createProduct function is called when the form is submitted
  async function saveProduct(ev) {
    // Prevent the browser from submitting the form
    ev.preventDefault();

    // data is an object with the form field names and values
    const data = { title, description, price };

    if (_id) {
      //update
      await axios.put("/api/products/", { ...data, _id });
    } else {
      //create

      // Send a POST request to the API endpoint with the form data
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  // go to products page after save
  if (goToProducts) {
    router.push("/products");
  }

  // The uploadImages function is called when the user selects files
  async function uploadImages(ev) {
    // ev.target.files is an array of the selected files (multiple files can be selected)
    const files = ev.target?.files;

    // Create a FormData object, which will be sent as the request body to the API endpoint /api/upload.js when the form is submitted
    if (files?.length > 0) {
      const data = new FormData();
      // Append the files to the FormData object
      for (const file of files) {
        data.append("files", file);
      }
      // Send a POST request to the API endpoint /api/upload.js with the FormData object as the request body (the files will be sent as multipart/form-data)
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      console.log(res.data);
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        // value is the state variable
        value={title}
        // ev.target.value is the value of the input field
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Photos</label>
      <div className="mb-2">
        {!!images?.length &&
          images.map((link) => (
            <div key={link}>
              <img
                src={link}
                alt=""
              />
            </div>
          ))}
        <label className="w-24 h-24 text-center cursor-pointer flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          {/* The input field is hidden, but we can trigger it by clicking on the label and then upload the selected files */}
          <input
            type="file"
            className="hidden"
            onChange={uploadImages}
          />
        </label>
        {/* Show the uploaded images as thumbnails. If there are no images, show
        a message */}
        {!images?.length && <div>No photos in this product</div>}
      </div>

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
  );
}

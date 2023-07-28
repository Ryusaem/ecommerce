import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// axios is a library to make HTTP requests
import axios from "axios";
// Spinner is a component that shows a loading spinner
import Spinner from "./Spinner";
// ReactSortable is a component that allows to drag and drop elements
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  // _id is the id of the product that is being edited (if any) and is used to fetch the product data
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  // properties is an object with the properties that are already filled for the product and we rename it to assignedProperties to avoid confusion with the productProperties state variable
  properties: assignedProperties,
}) {
  // The state variables are used to store the form field values
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  // category is the id of the selected category
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  // goToProducts is a boolean that is used to redirect the user to the products page after the product has been saved
  const [goToProducts, setGoToProducts] = useState(false);
  // isUploading is a boolean that is used to show a spinner while the images are being uploaded
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  // categories is an array of objects with the category data (name, properties, etc.)
  const [categories, setCategories] = useState([]);

  // Fetch the categories from the API
  useEffect(() => {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }, []);

  // the saveProduct function is called when the form is submitted. It sends a POST request to the API endpoint /api/products.js and PUT request to /api/products.js
  async function saveProduct(ev) {
    // Prevent the browser from submitting the form
    ev.preventDefault();

    // data is an object with the form field names and values
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

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
      setIsUploading(true);
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
      setIsUploading(false);
    }
  }

  // updateImagesOrder is called when the user drags and drops the images
  function updateImagesOrder(images) {
    setImages(images);
  }

  // setProductProp is a function that is used to update the productProperties state variable (which is an object) with the property name and value
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  // propertiesToFill is an array of objects with the properties that need to be filled for the selected category and its parents
  const propertiesToFill = [];
  // If the category is selected, find the category data and the parent categories data. categories is an array of objects with the category data (name, properties, etc.) and category is the id of the selected category
  if (categories.length > 0 && category) {
    // Find the category data
    let catInfo = categories.find(({ _id }) => _id === category);
    // Add the properties of the category and its parents to the propertiesToFill array
    propertiesToFill.push(...catInfo.properties);
    // Loop through the parent categories until there are no more parents
    while (catInfo?.parent?._id) {
      // Find the parent category data
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      // Add the properties of the parent category to the propertiesToFill array
      propertiesToFill.push(...parentCat.properties);
      // Set the parent category as the current category
      catInfo = parentCat;
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

      <label>Category</label>
      <select
        value={category}
        onChange={(ev) => setCategory(ev.target.value)}
      >
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="">
            <label className="capitalize">{p.name}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img
                  src={link}
                  alt=""
                  className="rounded-lg"
                />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-center cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
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

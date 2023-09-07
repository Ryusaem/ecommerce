import { useEffect, useState } from "react";
// useRouter is a hook from next/router that allows to get the current route
import { useRouter } from "next/router";

// ReactSortable is a component that allows to drag and drop elements
import { ReactSortable } from "react-sortablejs";

// axios is a library to make HTTP requests
import axios from "axios";
// Spinner is a component that shows a loading spinner
import Spinner from "./Spinner";

// GOAL: Create a form component that will allow to CREATE a NEW product or EDIT an existing product.

// - We use it in products/edit/[...id].js: contain the form to edit a product
// - We use it in new.js: contain the form to create a new product

export default function ProductForm({
  // _id is the id of the product that is being edited (if any) and is used to fetch the product data
  _id,
  // why did we rename title to existingTitle? Because we already have a state variable called title
  title: existingTitle,
  // why did we rename description to existingDescription? Because we already have a state variable called description
  description: existingDescription,
  // why did we rename price to existingPrice? Because we already have a state variable called price
  price: existingPrice,
  // why did we rename images to existingImages? Because we already have a state variable called images
  images: existingImages,
  //why assignedCategory? Because we already have a state variable called category
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
  // categories is an array of objects with the category data (name, properties, etc.)
  const [categories, setCategories] = useState([]);

  // goToProducts is a boolean that is used to redirect the user to the products page after the product has been saved
  const [goToProducts, setGoToProducts] = useState(false);

  // isUploading is a boolean that is used to show a spinner while the images are being uploaded
  const [isUploading, setIsUploading] = useState(false);

  // router is an object that contains information about the current route
  const router = useRouter();

  // FETCH the categories from the API every time the component is rendered
  useEffect(() => {
    // "result" is an object with the response data (it contain the categories)
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

    // If the product has an id, it means that we are editing an existing product and if the id is not present, it means that we are creating a new product
    if (_id) {
      //UPDATE
      // Send a PUT request to the API endpoint with the form data
      await axios.put("/api/products/", { ...data, _id });
    } else {
      //CREATE
      // Send a POST request to the API endpoint with the form data
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  // REDIRECT to products page after save
  if (goToProducts) {
    router.push("/products");
  }

  // The uploadImages function is called when the user selects files
  async function uploadImages(ev) {
    // ev.target.files is an array of the selected files (multiple files can be selected)
    const files = ev.target?.files;

    // Create a FormData object, which will be sent as the request body to the API endpoint /api/upload.js when the form is submitted.
    // a FormData is a special object that allows to send files as the request body of a POST request. It contains the files that will be uploaded
    // a request body is the data that is sent to the API endpoint. It can be a string, an object, a file, etc.
    if (files?.length > 0) {
      // Set isUploading to true to show the spinner
      setIsUploading(true);

      // our data will contain the files that will be uploaded
      const data = new FormData();

      // Append the files to the FormData object (our variable called data).
      // Every file is appended to the FormData object (our variable called data with the name "files"). "files" is the name of the field that will be sent to the API endpoint /api/upload.js
      for (const file of files) {
        data.append("files", file);
      }

      // Send a POST request to the API endpoint /api/upload.js with the FormData object (our variable called data) as the request body (the files will be sent as multipart/form-data)
      const res = await axios.post("/api/upload", data);

      // [...oldImages, ...res.data.links] is an array of strings with the links of the uploaded images. We use the spread operator to merge the old images with the new images
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });

      // Set isUploading to false to hide the spinner
      setIsUploading(false);
    }
  }

  // updateImagesOrder is called when the user drags and drops the images. How can we use the drag and drop feature? We use the ReactSortable component. So this function will be use inside a ReactSortable component
  function updateImagesOrder(images) {
    setImages(images);
  }

  // setProductProp is a function that is used to update the productProperties state variable (the state variable that contains the properties that are already filled for the product). It means that when the user selects a value for a property, the productProperties state variable will be updated
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      // prev is the previous state of the productProperties state variable. Here we create a new object (newProductProps) with the previous state  and we update the property that was changed
      const newProductProps = { ...prev };
      // propName is the name of the property that was changed and value is the new value of the property. We update the property that was changed
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  // propertiesToFill is an array of objects with the properties that need to be filled for the selected category and its parents
  const propertiesToFill = [];

  // If the category is selected, find the category data and the parent categories data. categories is an array of objects with the category data (name, properties, etc.) and category is the id of the selected category
  if (categories.length > 0 && category) {
    // catInfo will contain the category data of the selected category
    let catInfo = categories.find(({ _id }) => _id === category);

    // Add the properties of the category and its parents to the "propertiesToFill" array.
    propertiesToFill.push(...catInfo.properties);

    // Loop through the parent categories until there are no more parents.
    while (catInfo?.parent?._id) {
      // Find the parent category data.
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
    // When the form is submitted, the saveProduct function is called
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        // value is the state variable "title"
        value={title}
        // ev.target.value is the value of the input field. So when the user types in the input field, the title state variable will be updated
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Category</label>
      <select
        // value is the state variable "category"
        value={category}
        // ev.target.value is the value of the select field. So when the user selects a category, the category state variable will be updated
        onChange={(ev) => setCategory(ev.target.value)}
      >
        {/* The first option is "Uncategorized" and the other options are the categories */}
        <option value="">Uncategorized</option>

        {/* we loop through the categories and we create an option for each category */}
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

      {/* Loop through the properties that need to be filled for the selected category and its parents */}
      {/* properties contain properties like color, size, etc. */}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="">
            <label className="capitalize">{p.name}</label>

            <div>
              <select
                // value is the value of the property that is already filled for the product (if any) (for example: "red")
                value={productProperties[p.name]}
                // When the user selects a value for the property, the productProperties state variable will be updated
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {/* We loop through the values of the property (for example: "red", "blue", etc.) and we create an option for each value */}
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

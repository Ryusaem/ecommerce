// Image is a component that allows to show images
// import Image from "next/image";

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

// Algorithm:
// - 0 step: we get the props from the ([...id].js or new.js) component (title, description, price, images, category, properties). If we are editing a product, the props will contain the product data. If we are creating a new product, the props will be empty.

// If "product data" (props) is present →
// - 1 step: fetch the categories from the API. We need the categories to show the categories in the select field.
// - 2 step: fetch the product data from the API (if we are editing a product). We need the product data to show the product data in the form fields.

// If "product data" (props) is not present →
// - step 1:  we are creating a new product and we don't need to fetch the product data from the API

// When the user clicks on the "Save" button →
// - step 1: when the user submits the form:
//      - send a POST request to the API endpoint /api/products.js (if we are creating a new product) OR
//      - sent a PUT request to /api/products.js (if we are editing a product).
// - step 2: redirect the user to the products page

// When the user selects files→
// - 1 step: when the user selects files (for example when the user clicks on the "Upload" button and selects files), update the images state variable
// - 2 step: show a spinner while the images are being uploaded
// - 3 step: send a POST request to the API endpoint /api/upload.js with the files that will be uploaded
// - 4 step: display the uploaded images

// When the user drags and drops the images →
// - 1 step: when the user drags and drops the images, update the images state variable

export default function ProductForm({
  // _id is the id of the product that is being edited (if any) and is used to fetch the product data. If there is no _id, it means that we are creating a new product
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

  // ---- FETCH THE CATEGORIES DATA ----
  // FETCH the categories from the API every time the component is rendered
  useEffect(() => {
    // "result" is an object with the response data (it contain the categories)
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }, []);

  // ---- UPDATE OR CREATE PRODUCT ----
  // the "saveProduct" function is called when the FORM is SUBMITTED. It sends a POST request to the API endpoint /api/products.js and PUT request to /api/products.js.
  // So when the user clicks on the "Save" button, the "saveProduct" function is called
  async function saveProduct(ev) {
    // Prevent the browser from submitting the form
    ev.preventDefault();

    // data is an object with the form field names and values.
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    // API call for Editing or Creating a product
    // If the product has an id, it means that we are EDITING an existing product and if the id is not present, it means that we are creating a new product
    if (_id) {
      //UPDATE (EDITING)
      // Send a PUT request to the API endpoint with the form data
      await axios.put("/api/products/", { ...data, _id });
    } else {
      //CREATE
      // Send a POST request to the API endpoint with the form data
      await axios.post("/api/products", data);
    }
    // Set goToProducts to true to redirect the user to the products page
    setGoToProducts(true);
  }
  // REDIRECT to products page after save
  if (goToProducts) {
    router.push("/products");
  }

  // ---- UPLOAD IMAGES ----
  // The "uploadImages" function is called when the user selects files. For example when the user clicks on the "Upload" button and selects files. It sends a POST request to the API endpoint /api/upload.js
  async function uploadImages(ev) {
    // "files" variable will contain an array of files (images url here)
    // ev.target.files is an array of the selected files (multiple files can be selected).
    const files = ev.target?.files;

    // Create a FormData object, which will be sent as the request body to the API endpoint /api/upload.js when the form is submitted.
    // A "request body" is the data that is sent to the API endpoint. It can be a string, an object, a file, etc.
    // a "FormData" is a special object that allows to send files as the request body of a POST request. It contains the files that will be uploaded
    if (files?.length > 0) {
      // Set isUploading to true to show the spinner
      setIsUploading(true);

      // our data will contain the files that will be uploaded
      const data = new FormData();

      // Append the files to the FormData object (our variable called "data").
      // Every file is appended to the FormData object (our variable called "data"). "files" is the name of the field that will be sent to the API endpoint /api/upload.js
      for (const file of files) {
        data.append("files", file);
      }

      // Send a POST request to the API endpoint /api/upload.js with the FormData object (our variable called "data") as the request body
      // "res" variable will contain the response data (it contain the links of the uploaded images).
      const res = await axios.post("/api/upload", data);

      // [...oldImages, ...res.data.links] is an array of strings with the links of the uploaded images. We use the spread operator to merge the old images with the new images
      //res.data.link is an array of strings with the links of the uploaded images
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });

      // Set isUploading to false to hide the spinner
      setIsUploading(false);
    }
  }

  // ---- DRAG AND DROP IMAGES ----
  // updateImagesOrder is called when the user drags and drops the images. How can we use the drag and drop feature? We use the ReactSortable component. So this function will be use inside a ReactSortable component
  function updateImagesOrder(images) {
    setImages(images);
  }

  // ---- UPDATE PRODUCT PROPERTIES ----
  // setProductProp is a function that is used to update the productProperties state variable (the state variable that contains the properties that are already filled for the product).
  // Example when a user selects "red" for the "color" property, the productProperties state variable will be updated
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      // prev is the previous state of the productProperties state variable. Here we create a new object (newProductProps) with the previous state  and we update the property that was changed
      const newProductProps = { ...prev };
      // propName is the name of the property that was changed and value is the new value of the property. We update the property that was changed
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  // ---- GET THE PROPERTIES THAT NEED TO BE FILLED FOR THE SELECTED CATEGORY AND ITS PARENTS ----
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
        // value is the STATE variable "title"
        value={title}
        // ev.target.value is the value of the input field. So when the user types in the input field, the title state variable will be updated
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select
        // value is the STATE variable "category"
        value={category}
        // ev.target.value is the value of the select field. So when the user selects a category, the category state variable will be updated
        onChange={(ev) => setCategory(ev.target.value)}
      >
        {/* The first option is "Uncategorized" and the other options are the categories */}
        <option value="">Uncategorized</option>

        {/* we loop through the categories and we create an option for each category */}
        {/* For example if we have 3 categories (shoes, shirts, pants), we will have 3 options */}
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
      {/* For example if we have 2 properties (color and size), we will have 2 select fields */}
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div
            className=""
            key={p.name}
          >
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
                  <option
                    value={v}
                    key={v}
                  >
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        {/* ReactSortable is a component that allows to drag and drop elements */}
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
        >
          {/* Loop through the images (url link) if any and create an image for each image */}
          {/* The !! is a double negation trick in JavaScript that coerces any value to its equivalent boolean value.*/}
          {/* ! inverts the boolean value, whereas !! ensures that a value is returned as its boolean equivalent...example at the bottom of the code */}
          {/* So for example if we have 3 images, we will have 3 divs with the images */}
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
        {/* Show the spinner while the images are being uploaded */}
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}

        {/* The label is used to trigger the input field */}
        {/* So when the user clicks on the label, the input field will be
        triggered and the user can select files */}
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
      {/* ---- DESCRIPTION ---- */}
      {/* For example, description will be "This is a nice product" */}
      {/* If the user is editing a product, the description will be the
      description of the product */}
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      {/* ---- PRICE ---- */}
      <label>Price in euro</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      {/* ---- SAVE BUTTON ---- */}
      {/* when the user clicks on the button, the "saveProduct" function is called */}
      <button
        className="btn-primary"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}

//  !: This is a single negation. It will take a value and return the opposite of its boolean equivalent.
//     !true returns false
//     !false returns true
//     ![] returns false because an empty array is truthy in JavaScript.
//     !0 returns true because 0 is falsy in JavaScript.

// !!: This is a double negation. It takes a value and returns its boolean equivalent without changing its truthiness or falsiness.
//     !!true returns true
//     !!false returns false
//     !![] returns true because an empty array is truthy in JavaScript.
//     !!0 returns false because 0 is falsy in JavaScript.

import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
// import { withSwal } from "sweetalert2-react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  // editedCategory is the category that is being edited
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories and set the categories state
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      // If we are editing a category, we need to send the id and data._id is the id of the category
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
      setParentCategory("");
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    fetchCategories();
  }

  // Set the editedCategory state and set the name and parentCategory state
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id);
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        // when confirm button is clicked
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category: ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form
        onSubmit={saveCategory}
        className="flex gap-1"
      >
        <input
          type="text"
          placeholder="Category name"
          className="mb-0"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="">No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        <button
          type="submit"
          className="btn-primary"
        >
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className="btn-primary mr-1"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => deleteCategory(category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

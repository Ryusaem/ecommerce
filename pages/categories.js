import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function categories() {
  const [name, setName] = useState("");
  async function saveCategory(ev) {
    ev.preventDefault();
    await axios.post("/api/categories", { name });
    setName("");
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category name</label>
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
        <button
          type="submit"
          className="btn-primary"
        >
          Save
        </button>
      </form>
    </Layout>
  );
}

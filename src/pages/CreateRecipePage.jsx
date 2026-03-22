// src/pages/CreateRecipePage.jsx
import { useState, useEffect } from "react";
import RecipeForm from "../components/recipes/RecipeForm";
import API_URL from "../services/api";

export default function CreateRecipePage() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    setCategories(["Ensaladas","Pastas","Potajes","Fritos","Platos fríos","Guisados","Grillados","Pescados","Caldos","Dulces"]);
    setTypes(["Aperitivos","Primeros","Segundos","Postres"]);
  }, []);

  const handleAddRecipe = async (formData, token) => {
    // token viene del RecipeForm
    try {
      const res = await fetch(`${API_URL}/recipes`, {
        method: "POST",
        headers: { Authorization: token },
        body: formData
      });
      if (!res.ok) throw new Error("Error creando receta");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">Crear nueva receta</h2>
      <RecipeForm onSubmit={handleAddRecipe} categories={categories} types={types} />
    </div>
  );
}
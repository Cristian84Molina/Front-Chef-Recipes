// src/pages/CreateRecipePage.jsx
import { useState, useEffect } from "react";
import RecipeForm from "../components/recipes/RecipeForm";

export default function CreateRecipePage() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Para traer categorías y tipos desde backend si los tuvieras
  useEffect(() => {
    // Por ahora, valores hardcodeados
    setCategories(["Ensaladas","Pastas","Potajes","Fritos","Platos fríos","Guisados","Grillados","Pescados","Caldos","Dulces"]);
    setTypes(["Aperitivos","Primeros","Segundos","Postres"]);
  }, []);

  const handleAddRecipe = (newRecipe) => {
    console.log("Receta creada:", newRecipe);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">Crear nueva receta</h2>
      <RecipeForm onAddRecipe={handleAddRecipe} categories={categories} types={types} />
    </div>
  );
}
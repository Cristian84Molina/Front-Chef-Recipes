import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeForm from "../components/recipes/RecipeForm";
import API_URL from "../services/api";

export default function EditRecipePage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`${API_URL}/recipes/${id}`);
      const data = await res.json();
      setRecipe(data);
    };

    fetchRecipe();
  }, [id]);

  const handleUpdate = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/recipes/${id}`, {
      method: "PUT",
      body: formData // No agregues headers, el navegador lo hace solo con FormData
    });

    if (res.ok) {
      navigate(`/recipes/${id}`);
    } else {
      alert("Error al actualizar la receta");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  if (!recipe) return <p>Cargando receta...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">
        Editar receta
      </h2>

      <RecipeForm
        initialData={recipe}
        onSubmit={handleUpdate}
      />
    </div>
  );
}


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

    const res = await fetch(`${API_URL}/recipes/${id}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      navigate(`/recipes/${id}`);
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


// src/components/recipes/RecipeCard.jsx
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../services/api";

export default function RecipeCard({ recipe, user }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Función para eliminar receta
  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar esta receta?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/recipes/${recipe.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: token } : {},
      });
      if (res.ok) {
        alert("Receta eliminada");
        // Recargar la página o redirigir a /recipes
        navigate(0);
      } else {
        alert("No se pudo eliminar la receta");
      }
    } catch (err) {
      console.error(err);
      alert("Error eliminando receta");
    }
  };

  return (
    <div className="border rounded shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      {recipe.image && (
        <img
          src={recipe.image || "https://via.placeholder.com"}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded"
        />
      )}

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 text-chefBrown">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {recipe.category} • {recipe.type}
        </p>

        <Link
          to={`/recipes/${recipe.id}`}
          className="mt-auto text-chefRed hover:text-chefBrown font-semibold"
        >
          Ver receta
        </Link>

        {/* Botones solo si el usuario es dueño */}
        {user && user.id === recipe.user_id && (
          <div className="flex gap-2 mt-2">
            <Link
              to={`/recipes/edit/${recipe.id}`}
              className="bg-chefRed text-white px-4 py-1 rounded hover:bg-chefBrown transition"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
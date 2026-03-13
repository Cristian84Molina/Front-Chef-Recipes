// src/components/recipes/RecipeCard.jsx
import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
  return (
    <div className="border rounded shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      {recipe.image && (
        <img
  src={recipe.image ? `http://localhost:5000${recipe.image}` : ""}
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
      </div>
    </div>
  );
}
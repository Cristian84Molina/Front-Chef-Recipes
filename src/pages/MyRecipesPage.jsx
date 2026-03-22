import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/layout/UserContext";
import { fetchMyRecipes } from "../services/auth";
import RecipeCard from "../components/recipes/RecipeCard";

export default function MyRecipesPage() {
  const { token } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await fetchMyRecipes(token);
        setRecipes(data);
      } catch (err) {
        console.error(err);
        alert("Error trayendo tus recetas");
      }
    };
    load();
  }, [token]);

  if (!token) return <p>Debes iniciar sesión para ver tus recetas</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">Mis Recetas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.length > 0 ? (
          recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
        ) : (
          <p>No tienes recetas aún</p>
        )}
      </div>
    </div>
  );
}
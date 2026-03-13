import { useState, useEffect } from "react";
import RecipeCard from "../components/recipes/RecipeCard";
import API_URL from "../services/api";

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(9); // recetas visibles iniciales

  // Traer todas las recetas del backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API_URL}/recipes`);
        const data = await res.json();
        setAllRecipes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, []);

  // Filtrar recetas por búsqueda, categoría y tipo
  const filteredRecipes = allRecipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) &&
    (categoryFilter ? r.category === categoryFilter : true) &&
    (typeFilter ? r.type === typeFilter : true)
  );

  // Recetas visibles según "Ver más"
  const visibleRecipes = filteredRecipes.slice(0, visibleCount);

  // Resetear visibleCount cuando cambien filtros o búsqueda
  useEffect(() => {
    setVisibleCount(9);
  }, [search, categoryFilter, typeFilter]);

  // Categorías y tipos dinámicos
  const categories = [...new Set(allRecipes.map(r => r.category))];
  const types = [...new Set(allRecipes.map(r => r.type))];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">
        Todas mis recetas
      </h2>

      {/* Buscador y filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar receta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border p-2 rounded"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-1/3 border p-2 rounded"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-1/3 border p-2 rounded"
        >
          <option value="">Todos los tipos</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Grid de recetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleRecipes.length > 0 ? (
          visibleRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
        ) : (
          <p className="text-gray-500 col-span-full">No se encontraron recetas</p>
        )}
      </div>

      {/* Botón Ver más */}
      {visibleCount < filteredRecipes.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="bg-chefRed text-white px-6 py-2 rounded hover:bg-chefBrown transition"
          >
            Ver más
          </button>
        </div>
      )}
    </div>
  );
}
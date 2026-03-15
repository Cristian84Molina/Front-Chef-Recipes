// src/components/recipes/RecipeForm.jsx
import { useState, useEffect } from "react";
import API_URL from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function RecipeForm({ initialData, onSubmit }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const defaultCategories = [
    "Ensaladas", "Pastas", "Potajes", "Fritos", "Platos fríos",
    "Guisados", "Grillados", "Pescados", "Caldos", "Dulces"
  ];

  const defaultTypes = ["Aperitivo", "Primeros", "Segundos", "Postres"];

  // Cargar datos al editar
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "");
      setType(initialData.type || "");
      setDescription(initialData.description || "");
      if (initialData.ingredients) {
        try {
          const parsed = Array.isArray(initialData.ingredients)
            ? initialData.ingredients
            : JSON.parse(initialData.ingredients);
          setIngredients(parsed);
        } catch {
          setIngredients(initialData.ingredients.split(","));
        }
      }
    }
  }, [initialData]);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !type || !description || ingredients.every(i => !i.trim())) {
      alert("Completa todos los campos, incluyendo al menos un ingrediente");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("description", description);
      formData.append("ingredients", JSON.stringify(ingredients.filter(i => i.trim() !== "")));
      if (photo) formData.append("photo", photo);

      // Si existe onSubmit → edición
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Creación de receta
        const res = await fetch(`${API_URL}/recipes`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error al crear la receta");

        const data = await res.json();
        console.log("Receta creada:", data);

        // Limpiar formulario
        setName("");
        setCategory("");
        setType("");
        setIngredients([""]);
        setDescription("");
        setPhoto(null);

        alert("Receta creada con éxito!");
        navigate("/recipes");
      }
    } catch (err) {
      console.error(err);
      alert("Error al guardar la receta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nombre de la receta"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Selecciona categoría</option>
        {defaultCategories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Selecciona tipo</option>
        {defaultTypes.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Ingredientes</label>
        {ingredients.map((ing, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              placeholder={`Ingrediente ${idx + 1}`}
              value={ing}
              onChange={(e) => handleIngredientChange(idx, e.target.value)}
              className="border p-2 rounded flex-1"
            />
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600 transition"
              >X</button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="bg-chefRed text-white px-4 py-1 rounded hover:bg-chefBrown transition mt-1"
        >
          Agregar ingrediente
        </button>
      </div>

      <textarea
        placeholder="Descripción / paso a paso"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
        rows={4}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-chefRed text-white px-6 py-2 rounded hover:bg-chefBrown transition"
      >
        {initialData ? "Actualizar receta" : "Guardar receta"}
      </button>
    </form>
  );
}


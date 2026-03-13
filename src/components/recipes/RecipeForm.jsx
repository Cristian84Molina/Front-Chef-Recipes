// src/components/recipes/RecipeForm.jsx
import { useState, useEffect } from "react";
import API_URL from "../../services/api";

export default function RecipeForm({ initialData, onSubmit }) {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);

  const defaultCategories = [
    "Ensaladas",
    "Pastas",
    "Potajes",
    "Fritos",
    "Platos fríos",
    "Guisados",
    "Grillados",
    "Pescados",
    "Caldos",
    "Dulces",
  ];

  const defaultTypes = ["Aperitivo", "Primeros", "Segundos", "Postres"];

  // ⭐ Cargar datos cuando editamos receta
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setCategory(initialData.category || "");
      setType(initialData.type || "");
      setDescription(initialData.description || "");

      let parsedIngredients = [""];

      if (initialData.ingredients) {
        if (Array.isArray(initialData.ingredients)) {
          parsedIngredients = initialData.ingredients;
        } else {
          try {
            parsedIngredients = JSON.parse(initialData.ingredients);
          } catch {
            parsedIngredients = initialData.ingredients.split(",");
          }
        }
      }

      setIngredients(parsedIngredients);
    }
  }, [initialData]);

  // Manejar cambios en ingredientes
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Agregar ingrediente
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  // Eliminar ingrediente
  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !category ||
      !type ||
      !description ||
      ingredients.every((i) => !i.trim())
    ) {
      alert(
        "Por favor completa todos los campos, incluyendo al menos un ingrediente"
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("description", description);

      formData.append(
        "ingredients",
        JSON.stringify(ingredients.filter((i) => i.trim() !== ""))
      );

      if (photo) formData.append("photo", photo);

      // ⭐ Si existe onSubmit → estamos EDITANDO
      if (onSubmit) {
        await onSubmit(formData);
        return;
      }

      // ⭐ Si no → estamos CREANDO
      const res = await fetch(`${API_URL}/recipes`, {
        method: "POST",
        body: formData,
      });

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
        {defaultCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Selecciona tipo</option>
        {defaultTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Ingredientes dinámicos */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Ingredientes</label>

        {ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2">

            <input
              type="text"
              placeholder={`Ingrediente ${index + 1}`}
              value={ing}
              onChange={(e) =>
                handleIngredientChange(index, e.target.value)
              }
              className="border p-2 rounded flex-1"
            />

            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600 transition"
              >
                X
              </button>
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
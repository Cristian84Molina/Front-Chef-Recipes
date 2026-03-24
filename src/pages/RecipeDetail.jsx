// src/pages/RecipeDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API_URL from "../services/api";
import { jwtDecode } from "jwt-decode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();
  const pdfRef = useRef();

  // 🔐 Obtener usuario desde token
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (e) {
      console.error("Token inválido");
    }
  }

  // 📄 Descargar PDF
  const handleDownloadPDF = async () => {
    const element = pdfRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`receta-${recipe.name}.pdf`);
  };

  // 🗑️ Eliminar receta
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta receta?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        alert("Receta eliminada");
        navigate("/recipes");
      } else {
        alert("No tienes permiso para eliminar esta receta");
      }
    } catch (error) {
      console.error(error);
      alert("Error eliminando receta");
    }
  };

  // 📥 Obtener receta
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const headers = token ? { Authorization: token } : {};
        const res = await fetch(`${API_URL}/recipes/${id}`, { headers });

        if (res.status === 403) {
          alert("No tienes permiso para ver esta receta");
          navigate("/recipes");
          return;
        }

        if (res.status === 404) {
          alert("Receta no encontrada");
          navigate("/recipes");
          return;
        }

        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  if (!recipe) return <p>Cargando receta...</p>;

  const ingredients = JSON.parse(recipe.ingredients);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">

      {/* 🔽 BOTÓN PDF */}
      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit"
      >
        Descargar PDF
      </button>

      {/* 🔽 CONTENIDO EXPORTABLE */}
      <div ref={pdfRef}>
        <Link
          to="/recipes"
          className="text-chefRed hover:text-chefBrown font-semibold"
        >
          ← Volver a todas las recetas
        </Link>

        {/* Imagen */}
        {recipe.image && (
          <div className="relative w-full h-64 md:h-96 rounded overflow-hidden shadow-lg mt-4">
            <img
              src={recipe.image || "https://via.placeholder.com"}
              alt={recipe.name}
              className="w-full h-48 object-cover rounded"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {recipe.name}
              </h2>
              <p className="text-sm md:text-base text-gray-200">
                {recipe.category} • {recipe.type}{" "}
                {!recipe.is_public && "(Privada)"}
              </p>
            </div>
          </div>
        )}

        {/* Contenido */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="md:w-1/3 bg-chefCream p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">Ingredientes</h3>
            <ul className="list-disc list-inside text-gray-700">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="md:w-2/3 bg-chefCream p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">Preparación</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {recipe.description}
            </p>
          </div>
        </div>

        {/* 🔐 Botones solo dueño */}
        {userId === recipe.user_id && (
          <div className="flex gap-4 mt-4">
            <Link
              to={`/recipes/edit/${recipe.id}`}
              className="bg-chefRed text-white px-6 py-2 rounded hover:bg-chefBrown transition"
            >
              Editar receta
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
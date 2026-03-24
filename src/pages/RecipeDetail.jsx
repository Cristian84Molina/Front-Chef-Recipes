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

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch {
      console.error("Token inválido");
    }
  }

  // 📄 GENERAR PDF (ESTABLE)
  const handleDownloadPDF = async () => {
    const element = pdfRef.current;

    const noPdf = document.querySelectorAll(".no-pdf");

    // ocultar elementos
    noPdf.forEach(el => el.style.display = "none");

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save(`receta-${recipe.name}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
    }

    // restaurar elementos
    noPdf.forEach(el => (el.style.display = "flex"));
  };

  // 🗑️ eliminar
  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta receta?")) return;

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
        alert("No autorizado");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 📥 fetch receta
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const headers = token ? { Authorization: token } : {};
        const res = await fetch(`${API_URL}/recipes/${id}`, { headers });

        if (res.status === 403 || res.status === 404) {
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

      {/* BOTÓN PDF */}
      <button
        onClick={handleDownloadPDF}
        className="no-pdf bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit"
      >
        Descargar PDF
      </button>

      {/* CONTENIDO EXPORTABLE */}
      <div ref={pdfRef}>
        
        {/* VOLVER */}
        <Link
          to="/recipes"
          className="no-pdf text-chefRed hover:text-chefBrown font-semibold"
        >
          ← Volver a todas las recetas
        </Link>

        {/* IMAGEN */}
        {recipe.image && (
          <div className="mt-4">
            <img
              src={recipe.image}
              alt={recipe.name}
              crossOrigin="anonymous"
              className="w-full h-64 object-cover rounded"
            />
          </div>
        )}

        {/* TITULO */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-chefBrown">
            {recipe.name}
          </h2>
          <p className="text-gray-600">
            {recipe.category} • {recipe.type}{" "}
            {!recipe.is_public && "(Privada)"}
          </p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          
          <div className="md:w-1/3 bg-chefCream p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Ingredientes</h3>
            <ul className="list-disc list-inside">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="md:w-2/3 bg-chefCream p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Preparación</h3>
            <p className="whitespace-pre-line">
              {recipe.description}
            </p>
          </div>

        </div>

        {/* BOTONES SOLO DUEÑO */}
        {userId === recipe.user_id && (
          <div className="no-pdf flex gap-4 mt-6">
            <Link
              to={`/recipes/edit/${recipe.id}`}
              className="bg-chefRed text-white px-6 py-2 rounded hover:bg-chefBrown"
            >
              Editar
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
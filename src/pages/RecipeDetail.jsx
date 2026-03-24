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

  // 📄 PDF PRO
  const handleDownloadPDF = async () => {
    const element = pdfRef.current;

    // ocultar elementos no deseados
    const noPdf = document.querySelectorAll(".no-pdf");
    noPdf.forEach(el => (el.style.display = "none"));

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff", // fondo blanco fijo
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 190; // margen
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // margen superior

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`receta-${recipe.name}.pdf`);
    } catch (error) {
      console.error("Error generando PDF:", error);
    }

    // volver a mostrar
    noPdf.forEach(el => (el.style.display = "block"));
  };

  // 🗑️ eliminar
  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar receta?")) return;

    const res = await fetch(`${API_URL}/recipes/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    if (res.ok) {
      alert("Receta eliminada");
      navigate("/recipes");
    } else {
      alert("No autorizado");
    }
  };

  // 📥 fetch receta
  useEffect(() => {
    const fetchRecipe = async () => {
      const headers = token ? { Authorization: token } : {};
      const res = await fetch(`${API_URL}/recipes/${id}`, { headers });

      if (res.status === 403 || res.status === 404) {
        navigate("/recipes");
        return;
      }

      const data = await res.json();
      setRecipe(data);
    };

    fetchRecipe();
  }, [id]);

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

      {/* CONTENIDO PDF */}
      <div ref={pdfRef} className="bg-white p-6 rounded shadow">

        {/* HEADER PRO */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-chefBrown">
            🍳 Chef Recipes
          </h1>
          <p className="text-gray-500 text-sm">
            Receta generada desde la app
          </p>
        </div>

        {/* VOLVER */}
        <Link
          to="/recipes"
          className="no-pdf text-chefRed hover:text-chefBrown font-semibold"
        >
          ← Volver
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
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">{recipe.name}</h2>
          <p className="text-gray-600">
            {recipe.category} • {recipe.type}{" "}
            {!recipe.is_public && "(Privada)"}
          </p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="md:w-1/3 bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Ingredientes</h3>
            <ul className="list-disc list-inside">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="md:w-2/3 bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Preparación</h3>
            <p className="whitespace-pre-line">{recipe.description}</p>
          </div>
        </div>

        {/* BOTONES SOLO DUEÑO */}
        {userId === recipe.user_id && (
          <div className="flex gap-4 mt-6 no-pdf">
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
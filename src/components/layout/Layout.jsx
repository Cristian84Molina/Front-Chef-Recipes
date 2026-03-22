// src/components/layout/Layout.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // elimina token
    navigate("/login"); // redirige a login
  };

  return (
    <div className="min-h-screen flex flex-col bg-chefCream">
      <header className="bg-chefRed text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">🍳 Chef Recipes</h1>

          {/* Botón menú mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Menu desktop */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/recipes" className="hover:underline">Recetas</Link>
            <Link to="/create" className="hover:underline">Crear</Link>
            <button
              onClick={handleLogout}
              className="bg-white text-chefRed px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden bg-chefBrown p-4 flex flex-col gap-3">
            <Link
              to="/recipes"
              className="text-white"
              onClick={() => setMenuOpen(false)}
            >
              Recetas
            </Link>
            <Link
              to="/create"
              className="text-white"
              onClick={() => setMenuOpen(false)}
            >
              Crear
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-white text-chefRed px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-4 w-full">{children}</main>

      <footer className="bg-chefBrown text-white text-center p-3">
        <p className="text-sm">🍽 Recetario personal de cocina</p>
      </footer>
    </div>
  );
}
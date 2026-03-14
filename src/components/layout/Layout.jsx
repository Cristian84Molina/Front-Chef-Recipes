// src/components/layout/Layout.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-chefCream">

      {/* HEADER */}
      <header className="bg-chefRed text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

          <h1 className="text-xl font-bold">
            🍳 Chef Recipes
          </h1>

          {/* Botón menu mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          {/* Menu desktop */}
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="hover:underline">Inicio</Link>
            <Link to="/recipes" className="hover:underline">Recetas</Link>
            <Link to="/create" className="hover:underline">Crear</Link>
          </nav>

        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden bg-chefBrown p-4 flex flex-col gap-3">
            <Link to="/" className="text-white" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/recipes" className="text-white" onClick={() => setMenuOpen(false)}>Recetas</Link>
            <Link to="/create" className="text-white" onClick={() => setMenuOpen(false)}>Crear</Link>
          </div>
        )}

      </header>

      {/* CONTENIDO */}
      <main className="flex-1 max-w-6xl mx-auto p-4 w-full">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-chefBrown text-white text-center p-3">
        <p className="text-sm">🍽 Recetario personal de cocina</p>
      </footer>

    </div>
  );
}


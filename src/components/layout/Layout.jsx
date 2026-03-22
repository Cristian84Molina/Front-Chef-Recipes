import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logoutUser } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col bg-chefCream">
      <header className="bg-chefRed text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">🍳 Chef Recipes</h1>

          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="hover:underline">Inicio</Link>
            <Link to="/recipes" className="hover:underline">Recetas</Link>
            {user ? (
              <>
                <Link to="/my" className="hover:underline">Mis Recetas</Link>
                <button onClick={logoutUser} className="hover:underline">Cerrar sesión</button>
              </>
            ) : (
              <Link to="/login" className="hover:underline">Login</Link>
            )}
          </nav>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-chefBrown p-4 flex flex-col gap-3">
            <Link to="/" className="text-white" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link to="/recipes" className="text-white" onClick={() => setMenuOpen(false)}>Recetas</Link>
            {user ? (
              <>
                <Link to="/my" className="text-white" onClick={() => setMenuOpen(false)}>Mis Recetas</Link>
                <button onClick={() => { logoutUser(); setMenuOpen(false); }} className="text-white">Cerrar sesión</button>
              </>
            ) : (
              <Link to="/login" className="text-white" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
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
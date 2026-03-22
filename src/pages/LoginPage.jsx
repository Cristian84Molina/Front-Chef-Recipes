// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error en login");
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("token", token);
      navigate("/recipes");
    } catch (err) {
      console.error(err);
      alert("Error en login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-chefCream">
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">Iniciar Sesión</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`text-white px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-chefRed hover:bg-chefBrown"}`}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-chefRed hover:underline">Registrate</Link>
      </p>
    </div>
  );
}
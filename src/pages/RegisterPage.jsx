// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Error al registrarse");
        setLoading(false);
        return;
      }

      alert("Registro exitoso! Iniciá sesión ahora.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-chefCream">
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">Registrarse</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link to="/" className="text-chefRed hover:underline">Iniciá sesión</Link>
      </p>
    </div>
  );
}
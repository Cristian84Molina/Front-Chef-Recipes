import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { UserContext } from "../components/layout/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      loginUser(data.user, data.token);
      navigate("/recipes"); // Redirige al listado de recetas
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-chefBrown">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-chefRed text-white px-6 py-2 rounded hover:bg-chefBrown transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
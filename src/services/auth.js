const API_URL = "https://back-chef-recipes.vercel.app/api";

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Error en login");
  return res.json(); // { token, user }
};

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Error en registro");
  return res.json(); // { id, email }
};

export const fetchMyRecipes = async (token) => {
  const res = await fetch(`${API_URL}/recipes/my`, {
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error("Error trayendo tus recetas");
  return res.json();
};
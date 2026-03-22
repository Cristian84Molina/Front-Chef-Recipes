import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Helper para rutas protegidas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/recipes" element={<PrivateRoute><Layout><RecipesPage /></Layout></PrivateRoute>} />
        <Route path="/recipes/:id" element={<PrivateRoute><Layout><RecipeDetail /></Layout></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><Layout><CreateRecipePage /></Layout></PrivateRoute>} />
        <Route path="/recipes/edit/:id" element={<PrivateRoute><Layout><EditRecipePage /></Layout></PrivateRoute>} />

        {/* Redirigir cualquier otra ruta al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
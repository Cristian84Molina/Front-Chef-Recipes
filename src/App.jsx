// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Layout from "./components/layout/Layout"; 
import RecipesPage from "./pages/RecipesPage"; 
import RecipeDetail from "./pages/RecipeDetail"; 
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Página principal / redirige a recetas */}
          <Route path="/" element={<RecipesPage />} />

          {/* Listado de todas las recetas */}
          <Route path="/recipes" element={<RecipesPage />} />

          {/* Detalle de receta individual */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />

          {/* Ruta comodín */}
          <Route path="*" element={<RecipesPage />} />

          <Route path="/create" element={<CreateRecipePage />} />
          <Route path="/recipes/edit/:id" element={<EditRecipePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
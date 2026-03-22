import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/layout/UserContext";
import Layout from "./components/layout/Layout";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetail from "./pages/RecipeDetail";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import LoginPage from "./pages/LoginPage";
import MyRecipesPage from "./pages/MyRecipesPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<RecipesPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/recipes/edit/:id" element={<EditRecipePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/my" element={<MyRecipesPage />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RecipeProvider, useRecipeContext } from './RecipeContext';
import './App.css';  // Import the CSS file

const RecipeFinder = () => {
  const [ingredients, setIngredients] = useState('');
  const {
    recipes,
    setRecipes,
    loading,
    setLoading,
    error,
    setError,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
  } = useRecipeContext();

  const API_KEY = '03d74dadbf9c47c69ccd5433b58124e7';
  const API_URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=`;
  const RECIPE_DETAIL_URL = `https://api.spoonacular.com/recipes/`;

  useEffect(() => {
    if (ingredients) {
      fetchRecipes();
    }
  }, [ingredients, currentPage]);

  // Fetch recipes from Spoonacular API
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}${ingredients}&number=10&offset=${(currentPage - 1) * 10}`);
      setRecipes(response.data);
      setTotalPages(Math.ceil(response.data.length / 10)); // Assuming each page has 10 results
    } catch (error) {
      setError('Error fetching recipes. Please try again later.');
    }
    setLoading(false);
  };

  // Handle the form submission
  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to first page when a new search is made
    fetchRecipes();
  };

  // Handle change in ingredients input field
  const handleInputChange = (event) => {
    setIngredients(event.target.value);
  };

  // Display Recipe Details
  const showRecipeDetails = async (id) => {
    try {
      const response = await axios.get(`${RECIPE_DETAIL_URL}${id}/information?apiKey=${API_KEY}`);
      alert(`Instructions: ${response.data.instructions}`);
    } catch (error) {
      alert('Error fetching recipe details.');
    }
  };

  return (
    <div className="container">
      <h1>Recipe Finder</h1>
      <form onSubmit={handleSearch} className="form">
        <input
          type="text"
          value={ingredients}
          onChange={handleInputChange}
          placeholder="Enter ingredients (e.g., chicken, tomato, garlic)"
          className="input"
        />
        <button type="submit" className="button">Search</button>
      </form>

      {loading && <p>Loading recipes...</p>}
      {error && <p className="error">{error}</p>}

      {recipes.length > 0 && (
        <div className="recipeList">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipeCard" onClick={() => showRecipeDetails(recipe.id)}>
              <img src={`https://spoonacular.com/recipeImages/${recipe.id}-312x231.jpg`} alt={recipe.title} className="recipeImage" />
              <h3>{recipe.title}</h3>
              <p><strong>Ingredients:</strong> {recipe.usedIngredients.map((ingredient) => ingredient.name).join(', ')}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

const App = () => (
  <RecipeProvider>
    <RecipeFinder />
  </RecipeProvider>
);

export default App;

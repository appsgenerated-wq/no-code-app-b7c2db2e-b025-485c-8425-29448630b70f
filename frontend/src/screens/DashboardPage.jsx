import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, recipes, onLogout, onLoadRecipes, onCreateRecipe, onDeleteRecipe }) => {
  const [newRecipe, setNewRecipe] = useState({ name: '', ingredients: '', instructions: '', prepTime: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    onLoadRecipes();
  }, [onLoadRecipes]);

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    setError('');
    if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const recipeData = {
        ...newRecipe,
        prepTime: parseInt(newRecipe.prepTime, 10) || 0,
      };
      await onCreateRecipe(recipeData, photoFile);
      setNewRecipe({ name: '', ingredients: '', instructions: '', prepTime: '' });
      setPhotoFile(null);
      e.target.reset(); // Reset form fields including file input
    } catch (err) {
      setError('Failed to create recipe. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-900">PitaPerfect Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}!</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300">Admin Panel</a>
            <button onClick={onLogout} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">Logout</button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Share a New Recipe</h2>
              <form onSubmit={handleCreateRecipe} className="space-y-4">
                <input type="text" placeholder="Recipe Name" value={newRecipe.name} onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})} required className="w-full p-2 border border-gray-300 rounded-lg" />
                <textarea placeholder="Ingredients (one per line)" value={newRecipe.ingredients} onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})} required className="w-full p-2 border border-gray-300 rounded-lg h-24" />
                <textarea placeholder="Instructions" value={newRecipe.instructions} onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})} required className="w-full p-2 border border-gray-300 rounded-lg h-32" />
                <input type="number" placeholder="Prep Time (minutes)" value={newRecipe.prepTime} onChange={(e) => setNewRecipe({...newRecipe, prepTime: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Photo</label>
                  <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"/>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-300">Add Recipe</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Recipes</h2>
            {recipes.length === 0 ? (
              <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-500">No recipes found. Be the first to share one!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                    {recipe.photo && <img src={recipe.photo.url} alt={recipe.name} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />}
                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-900">{recipe.name}</h3>
                          {user.id === recipe.owner?.id && (
                            <button onClick={() => onDeleteRecipe(recipe.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Delete</button>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">By {recipe.owner?.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">Prep time: {recipe.prepTime || 'N/A'} mins</p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-semibold text-gray-800">Ingredients</h4>
                            <pre className="whitespace-pre-wrap font-sans text-gray-600 mt-1">{recipe.ingredients}</pre>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Instructions</h4>
                            <pre className="whitespace-pre-wrap font-sans text-gray-600 mt-1">{recipe.instructions}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
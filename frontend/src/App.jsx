import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import './index.css';
import { testBackendConnection, createManifestWithLogging } from './services/apiService.js';

function App() {
  const [user, setUser] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [recipes, setRecipes] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [loading, setLoading] = useState(true);

  const manifest = createManifestWithLogging('${appId}');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await manifest.from('User').me();
        setUser(currentUser);
        setCurrentScreen('dashboard');
      } catch (error) {
        setUser(null);
        setCurrentScreen('landing');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [])

  useEffect(() => {
    // Enhanced backend connection test with detailed logging
    const testConnection = async () => {
      console.log('🚀 [APP] Starting enhanced backend connection test...');
      console.log('🔍 [APP] Backend URL:', 'https://no-code-app-b7c2db2e-b025-485c-8425-29448630b70f-generated-apps-234234-234.us-central1.run.app');
      console.log('🔍 [APP] App ID:', 'b7c2db2e-b025-485c-8425-29448630b70f');
      
      setConnectionStatus('Testing connection...');
      
      const result = await testBackendConnection(3);
      setBackendConnected(result.success);
      
      if (result.success) {
        console.log('✅ [APP] Backend connection successful - proceeding with app initialization');
        setConnectionStatus('Connected');
        
        // Test Manifest SDK connection
        console.log('🔍 [APP] Testing Manifest SDK connection...');
        try {
          const manifest = createManifestWithLogging('b7c2db2e-b025-485c-8425-29448630b70f');
          console.log('✅ [APP] Manifest SDK initialized successfully');
        } catch (error) {
          console.error('❌ [APP] Manifest SDK initialization failed:', error);
          setConnectionStatus('SDK Error');
        }
      } else {
        console.error('❌ [APP] Backend connection failed - app may not work properly');
        console.error('❌ [APP] Connection error:', result.error);
        setConnectionStatus('Connection Failed');
      }
    };
    
    testConnection();
  }, []);;

  const login = async (email, password) => {
    await manifest.login(email, password);
    const currentUser = await manifest.from('User').me();
    setUser(currentUser);
    setCurrentScreen('dashboard');
  };

  const signup = async (name, email, password) => {
    await manifest.from('User').create({ name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setRecipes([]);
    setCurrentScreen('landing');
  };

  const loadRecipes = async () => {
    try {
      const response = await manifest.from('Recipe').find({ 
        include: ['owner'],
        sort: { createdAt: 'desc' }
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  const createRecipe = async (recipeData, file) => {
    try {
      if (file) {
        const uploadedFile = await manifest.upload(file);
        recipeData.photo = uploadedFile.id;
      }
      const newRecipe = await manifest.from('Recipe').create(recipeData);
      // Refetch recipes to get the latest list with owner data
      await loadRecipes();
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await manifest.from('Recipe').delete(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Failed to delete recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Enhanced Backend Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-2 rounded-lg text-xs font-medium shadow-lg ${backendConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{backendConnected ? '✅ Backend Connected' : '❌ Backend Disconnected'}</span>
          </div>
          <div className="text-xs opacity-75 mt-1">{connectionStatus}</div>
        </div>
      </div>
      
        <p className="text-gray-600">Loading PitaPerfect...</p>
      </div>
    );
  }

  return (
    <div>
      {currentScreen === 'landing' || !user ? (
        <LandingPage onLogin={login} onSignup={signup} />
      ) : (
        <DashboardPage 
          user={user} 
          recipes={recipes} 
          onLogout={logout} 
          onLoadRecipes={loadRecipes}
          onCreateRecipe={createRecipe}
          onDeleteRecipe={deleteRecipe}
        />
      )}
    </div>
  );
}

export default App;
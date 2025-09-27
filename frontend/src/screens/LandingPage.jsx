import React, { useState } from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginView) {
        await onLogin(email, password);
      } else {
        await onSignup(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-900">PitaPerfect</h1>
          <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">Admin Panel</a>
        </div>
      </header>
      <main className="flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Discover the Perfect <span className="text-yellow-600">Pita</span>.</h2>
              <p className="mt-4 text-lg text-gray-600">Join our community to share, find, and bake the best pita bread recipes from around the world. Your next delicious creation is just a click away.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{isLoginView ? 'Welcome Back' : 'Create Account'}</h3>
              <p className="text-center text-gray-500 mb-6">{isLoginView ? 'Sign in to continue.' : 'Get started with PitaPerfect.'}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginView && (
                  <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
                )}
                <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-yellow-700 transition duration-300">{isLoginView ? 'Login' : 'Sign Up'}</button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-6">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-semibold text-yellow-600 hover:text-yellow-700 ml-1">{isLoginView ? 'Sign Up' : 'Login'}</button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 

export default LandingPage;
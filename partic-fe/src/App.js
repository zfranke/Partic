import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import FormView from './components/FormView';
import AdminView from './components/AdminView';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsInitialized(true); // Mark initialization as complete
  }, []);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const handleRegister = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<Register onRegister={handleRegister} />}
        />
        <Route
          path="/admin"
          element={
            isInitialized ? ( // Render only after initialization
              isAuthenticated ? (
                <div>
                  <AdminView />
                  <button onClick={handleLogout}>Logout</button> {/* Logout button */}
                </div>
              ) : (
                <Navigate to="/login" />
              )
            ) : null
          }
        />
        <Route path="/" element={<FormView />} />
      </Routes>
    </Router>
  );
}

export default App;

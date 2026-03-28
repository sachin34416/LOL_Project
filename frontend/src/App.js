import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Main Pages
import Dashboard from './pages/Dashboard';
import PlayerManagement from './pages/PlayerManagement';
import TournamentManagement from './pages/TournamentManagement';
import GameTemplates from './pages/GameTemplates';
import MatchScheduling from './pages/MatchScheduling';
import LiveScoring from './pages/LiveScoring';
import PlayerStats from './pages/PlayerStats';
import './styles/App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize auth from localStorage on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="App flex h-screen bg-gray-100">
                <Sidebar isOpen={sidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/players" element={<PlayerManagement />} />
                      <Route path="/tournaments" element={<TournamentManagement />} />
                      <Route path="/games" element={<GameTemplates />} />
                      <Route path="/matches" element={<MatchScheduling />} />
                      <Route path="/live-scoring" element={<LiveScoring />} />
                      <Route path="/stats/:playerId" element={<PlayerStats />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

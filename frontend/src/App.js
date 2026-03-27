import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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

  return (
    <Router>
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
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

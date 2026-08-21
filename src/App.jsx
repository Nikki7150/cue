import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import DeckList from './pages/DeckList';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Review from './pages/Review';
import { useAuth } from './AuthContext'
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  const { user, loading } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/review/:deckId" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/decks" element={<ProtectedRoute><DeckList /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App

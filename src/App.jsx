import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import DeckList from './pages/DeckList';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Review from './pages/Review';
import { useAuth } from './AuthContext'
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const { user, loading } = useAuth();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/decks" element={<ProtectedRoute><DeckList /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App

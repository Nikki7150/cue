import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import DeckList from './pages/DeckList';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Review from './pages/Review';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/review" element={<Review />} />
        <Route path="/decks" element={<DeckList />} />
      </Routes>
    </div>
  )
}

export default App

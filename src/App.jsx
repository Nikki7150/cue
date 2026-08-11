import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<h1>Welcome to the App</h1>} />
      </Routes>
    </div>
  )
}

export default App

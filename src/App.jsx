import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <main>
        <h1>Welcome to the App</h1>
        <p>This is a simple React app with Vite.</p>
      </main>
    </div>
  )
}

export default App

import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import JournalPage from './pages/JournalPage'

import Navbar from './components/Navbar'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/journal" element={<JournalPage />}></Route>
      </Routes>
    </div>
  )
}

export default App

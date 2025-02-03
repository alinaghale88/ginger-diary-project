import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import JournalPage from './pages/JournalPage'
import Header from './components/Header'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='flex'>
      <Navbar className='z-50' />
      <div className='-ml-7'>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/journal" element={<JournalPage />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App

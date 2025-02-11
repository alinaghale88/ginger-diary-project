import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import JournalPage from './pages/JournalPage'
import Header from './components/Header'
import Navbar from './components/Navbar'
import { useAuthContext } from './hooks/useAuthContext'

const App = () => {
  const { user } = useAuthContext()

  return (
    <div className='flex'>
      <Navbar className='z-50' />
      <div className='-ml-7 w-full'>
        <Header />
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}></Route>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />}></Route>
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />}></Route>
          <Route path="/journal" element={user ? <JournalPage /> : <Navigate to="/login" />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App

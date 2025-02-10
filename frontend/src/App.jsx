import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import JournalPage from './pages/JournalPage'
import Header from './components/Header'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div className='flex'>
      <Navbar className='z-50' />
      <div className='-ml-7 w-full'>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/login" element={<LogIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/journal" element={<JournalPage />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App

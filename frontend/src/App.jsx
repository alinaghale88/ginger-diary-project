import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import JournalPage from './pages/JournalPage'
import Gallery from './pages/Gallery'
import ViewEntry from './pages/ViewEntry'
import Header from './components/Header'
import Navbar from './components/Navbar'
import { useAuthContext } from './hooks/useAuthContext'
import { Toaster } from './components/ui/toaster'
import CreateChapter from './pages/CreateChapter'
import ViewChapter from './pages/ViewChapter'

const App = () => {
  const { user } = useAuthContext()

  return (
    <div>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />}></Route>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />}></Route>
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />}></Route>
        <Route path="/journal" element={user ? <JournalPage /> : <Navigate to="/login" />}></Route>
        <Route path="/gallery" element={user ? <Gallery /> : <Navigate to="/login" />}></Route>
        <Route path="/view-entry/:id" element={user ? <ViewEntry /> : <Navigate to="/login" />}></Route>
        <Route path="/create-chapter/:id?" element={user ? <CreateChapter /> : <Navigate to="/login" />}></Route>
        <Route path="/chapter/:id" element={user ? <ViewChapter /> : <Navigate to="/login" />}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App

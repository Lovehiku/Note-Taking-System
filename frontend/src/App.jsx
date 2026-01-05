import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom' 
import Signup from './pages/signUp.jsx' 
import Login from './pages/login.jsx' 
import Dashboard from './pages/Dashboard.jsx'
import { useNavigate } from 'react-router-dom'
import CreateNote from './pages/createNote.jsx'
import './App.css'
import ViewNote from './pages/viewNote.jsx'
function Protected({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return children
}
function App() {
    const navigate = useNavigate()
    function handleLogin() { 
      navigate('/dashboard')
     }  
  return (
    <> 
    <Routes> 
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/login" element={<Login onLogin={handleLogin}/>} /> 
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} /> 
      <Route path="/createNote" element={<CreateNote />} /> 
      <Route path="/notes/:id" element={<Protected><ViewNote/></Protected>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes> </>
  )
}

export default App

import React from 'react'
import {   Routes, Route } from 'react-router-dom' 
import Navbar from './components/Navbar.jsx' 
import Signup from './pages/signUp.jsx' 
import Login from './pages/login.jsx' 
import Dashboard from './pages/Dashboard.jsx'
import { useNavigate } from 'react-router-dom'
import CreateNote from './pages/createNote.jsx'
import './App.css'

function App() {
    const navigate = useNavigate()
    function onLogout() { 
      localStorage.removeItem('token') 
      navigate('/login') }
    function handleLogin() { 
      navigate('/dashboard')
     }  
  return (
    <> <Navbar onLogout={onLogout} />
    <Routes> 
      <Route path="/signup" element={<Signup />} /> 
      <Route path="/login" element={<Login onLogin={handleLogin}/>} /> 
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/createNote" element={<CreateNote />} /> 
    </Routes> </>
  )
}

export default App

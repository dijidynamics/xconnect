import { useState} from 'react'
import React from 'react'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Admindashboard from './pages/Admindashboard';


function App() {
 

  return (
<Router>
  <div>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/singup' element={<Signup />} />
      <Route path="/dashboard/:email" element={<Dashboard />} />
      <Route path="/admindashboard" element={<Admindashboard />} />
    </Routes>
  </div>
</Router>
  )
}

export default App

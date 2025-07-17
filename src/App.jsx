import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddStudent from './pages/AddStudent.jsx'
import Layout from './components/Layout.jsx'
import ViewStudents from './pages/ViewStudents.jsx'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/view-students" element={<ViewStudents />} />
      </Routes>
    </Router>
  )
}

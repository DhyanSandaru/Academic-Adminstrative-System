import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddStudent from './pages/AddStudent.jsx'
import ViewStudents from './pages/ViewStudents.jsx'
import AddLecturer from './pages/AddLecturer.jsx'
import ViewLecturers from './pages/ViewLecturers.jsx'



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/view-students" element={<ViewStudents />} />
        <Route path="/add-lecturer" element={<AddLecturer />} />
        <Route path="/view-lecturers" element={<ViewLecturers />} />
      </Routes>
    </Router>
  )
}

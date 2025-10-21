import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddStudent from './pages/AddStudent.jsx'
import ViewStudents from './pages/ViewStudents.jsx'
import AddLecturer from './pages/AddLecturer.jsx'
import ViewLecturers from './pages/ViewLecturers.jsx'
import TimeTable from './pages/TimeTable.jsx'
import ViewPayment from './pages/ViewPayments.jsx'
import AddPayment from './pages/AddPayment.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import LecturerProfile from './pages/LecturerProfile.jsx'
import AdminProfile from './pages/AdminProfile.jsx'
import AddStudentForm from './pages/AddStudentForm.jsx'
import RegisterbyCode from './pages/RegisterbyCode.jsx'
import BackupManagement from './pages/BackupManagement.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin-profile" element={<AdminProfile />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/add-student/manual" element={<AddStudentForm />} />
        <Route path="/add-student/remote" element={<RegisterbyCode />} />
        <Route path="/view-students" element={<ViewStudents />} />
        <Route path="/view-students/:student_id" element={<StudentProfile/>}/>

        <Route path="/add-lecturer" element={<AddLecturer />} />
        <Route path="/view-lecturers/:lecturer_id" element={<LecturerProfile/>}/>
        <Route path="/view-lecturers" element={<ViewLecturers />} />

        <Route path="/timetable" element={<TimeTable/>}/>

        <Route path="view-payment" element={<ViewPayment/>}/>
        <Route path="/add-payment" element={<AddPayment/>}/>

        <Route path="/manage-backups" element={<BackupManagement/>}/>
        
      </Routes>
    </Router>
  )
}

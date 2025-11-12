import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import ViewStudents from "./pages/ViewStudents.jsx";
import AddLecturer from "./pages/AddLecturer.jsx";
import ViewLecturers from "./pages/ViewLecturers.jsx";
import TimeTable from "./pages/TimeTable.jsx";
import ViewPayment from "./pages/ViewPayments.jsx";
import AddPayment from "./pages/AddPayment.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import LecturerProfile from "./pages/LecturerProfile.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import AddStudentForm from "./pages/AddStudentForm.jsx";
import RegisterbyCode from "./pages/RegisterbyCode.jsx";
import BackupManagement from "./pages/BackupManagement.jsx";
import AddNewCourse from "./pages/AddNewCourse.jsx";
import ViewCourses from "./pages/ViewCourses.jsx";
import CourseProfile from "./pages/CourseProfile.jsx"

import  AuthProvider  from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute>
                <AdminProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-student"
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-student/manual"
            element={
              <ProtectedRoute>
                <AddStudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-student/remote"
            element={
              <ProtectedRoute>
                <RegisterbyCode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-students"
            element={
              <ProtectedRoute>
                <ViewStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-students/:student_id"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-lecturer"
            element={
              <ProtectedRoute>
                <AddLecturer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-lecturers/:lecturer_id"
            element={
              <ProtectedRoute>
                <LecturerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-lecturers"
            element={
              <ProtectedRoute>
                <ViewLecturers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <TimeTable />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-payment"
            element={
              <ProtectedRoute>
                <ViewPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-payment"
            element={
              <ProtectedRoute>
                <AddPayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-backups"
            element={
              <ProtectedRoute>
                <BackupManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-course"
            element={
              <ProtectedRoute>
                <AddNewCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-courses"
            element={
              <ProtectedRoute>
                <ViewCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-courses/:id"
            element={
              <ProtectedRoute>
                < CourseProfile/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

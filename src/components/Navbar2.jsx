import React from 'react'
import { Link } from 'react-router-dom';


export default function Navbar({ isOpen,setIsopen,admin }) {
  const initial = admin ? admin.charAt(0).toUpperCase() : 'A'

  return (
    <div className={`h-screen bg-[#121c3e] text-white flex flex-col transition-all duration-300 
  ${isOpen ? "w-72" : "w-0 overflow-hidden"}`}>

      {/* Admin Profile */}
      <div className="p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#ffc20e] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#ffc20e] flex items-center justify-center text-[#121c3e] font-semibold text-lg">
            {initial}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{admin}</h3>
          <p className="text-gray-300 text-sm">Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {/* Features Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Features</h4>
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-Linkenter gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/dashboard-icon.png" alt="Dashboard" className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/timetable"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/timetable-icon.png" alt="Time table" className="w-5 h-5" />
              <span>Time table</span>
            </Link>
          </div>
        </div>

        {/* Student Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Student Management</h4>
          <div className="space-y-1">
            <Link
              to="/add-student"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ffc20e] text-[#121c3e] font-medium"
            >
              <img src="/images/add_student.png" alt="Add student" className="w-5 h-5" />
              <span>Add student</span>
            </Link>
            <Link
              to="/view-students"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/view-students.png" alt="View students" className="w-5 h-5" />
              <span>View students</span>
            </Link>
          </div>
        </div>

        {/* Lecturer Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Lecturer Management</h4>
          <div className="space-y-1">
            <Link
              to="/add-lecturer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/add-lecturer.png" alt="Add Lecturer" className="w-5 h-5" />
              <span>Add Lecturer</span>
            </Link>
            <Link
              to="/view-lecturers"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/view-lecturers.png" alt="View lecturers" className="w-5 h-5" />
              <span>View lecturers</span>
            </Link>
          </div>
        </div>

        {/* Payment Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Payment Management</h4>
          <div className="space-y-1">
            <Link
              to="/add-payment"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/add-payment.png" alt="Add Payment" className="w-5 h-5" />
              <span>Add Payment</span>
            </Link>
            <Link
              to="/view-payments"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/view-payments.png" alt="View payments" className="w-5 h-5" />
              <span>View payments</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#ff0000] text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
          <img src="/images/log off.png" alt="Log Out" className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  )
}

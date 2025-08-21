import React from 'react'
import { Link } from 'react-router-dom';
import SidebarLink from './SideBarLink';


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
            <SidebarLink
              to="/dashboard"
              icon="/images/dashboard-icon.png"
              label="Dashboard" 
            />
            <SidebarLink
              to="/timetable"
              icon="/images/timetable-icon.png"
              label="Time Table" 
            />
          </div>
        </div>

        {/* Student Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Student Management</h4>
          <div className="space-y-1">
           <SidebarLink
              to="/add-student"
              icon="/images/add_student.png"
              label="Add Student" 
            />
            <SidebarLink
              to="/view-students"
              icon="/images/view-students.png"
              label="View Students" 
            />
          </div>
        </div>

        {/* Lecturer Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Lecturer Management</h4>
          <div className="space-y-1">
          <SidebarLink
              to="/add-lecturer"
              icon="/images/add-lecturer.png"
              label="Add Lecturer" 
            />
           <SidebarLink
              to="/view-lecturers"
              icon="/images/view-lecturers.png"
              label="View Lecturers" 
            />
          </div>
        </div>

        {/* Payment Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Payment Management</h4>
          <div className="space-y-1">
           <SidebarLink
              to="/add-payments"
              icon="/images/add-payment.png"
              label="Add Payments" 
            />
           <SidebarLink
              to="/view-payment"
              icon="/images/view-payments.png"
              label="View Payments" 
            />
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

import React from 'react'
import { Link } from 'react-router-dom';
import SidebarLink from './SideBarLink';
import { CalendarDays, LayoutDashboard, Power } from 'lucide-react';
import { IoPersonAdd,IoReceiptSharp } from 'react-icons/io5';
import { FaUserGraduate } from 'react-icons/fa6';
import { LiaUserPlusSolid } from 'react-icons/lia';
import { FaUserTie, FaMoneyCheckAlt } from 'react-icons/fa';

export default function Navbar({ isOpen,setIsopen,admin }) {
  const initial = admin ? admin.charAt(0).toUpperCase() : 'A'

  return (
    <div className={`h-screen bg-[#121c3e] text-white flex flex-col transition-all duration-300 
  ${isOpen ? "w-72" : "w-0 overflow-hidden"}`}>

      {/* Admin Profile */}
      <Link to="/admin-profile">
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
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {/* Features Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Features</h4>
          <div className="space-y-1">
            <SidebarLink
              to="/dashboard"
              Icon={LayoutDashboard}
              label="Dashboard" 
            />
            <SidebarLink
              to="/timetable"
              Icon={CalendarDays}
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
              Icon={IoPersonAdd}
              label="Add Student" 
            />
            <SidebarLink
              to="/view-students"
              Icon={FaUserGraduate}
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
              Icon={LiaUserPlusSolid}
              label="Add Lecturer" 
            />
           <SidebarLink
              to="/view-lecturers"
              Icon={FaUserTie}
              label="View Lecturers" 
            />
          </div>
        </div>

        {/* Payment Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Payment Management</h4>
          <div className="space-y-1">
           <SidebarLink
              to="/add-payment"
              Icon={FaMoneyCheckAlt}
              label="Add Payments" 
            />
           <SidebarLink
              to="/view-payment"
              Icon={IoReceiptSharp}
              label="View Payments" 
            />
          </div>
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <Link to="/">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#ff0000] text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
            <Power className='text-white'/>
            <span>Log Out</span>
          </button>
        </Link>
      </div>
    </div>
  )
}

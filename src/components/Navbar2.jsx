import React from 'react'

export default function Navbar({ admin }) {
  const initial = admin ? admin.charAt(0).toUpperCase() : 'A'

  return (
    <div className="w-72 h-screen bg-[#121c3e] text-white flex flex-col">
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
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/dashboard-icon.png" alt="Dashboard" className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/timetable-icon.png" alt="Time table" className="w-5 h-5" />
              <span>Time table</span>
            </a>
          </div>
        </div>

        {/* Student Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Student Management</h4>
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#ffc20e] text-[#121c3e] font-medium"
            >
              <img src="/images/student.png" alt="Add student" className="w-5 h-5" />
              <span>Add student</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/view-students.png" alt="View students" className="w-5 h-5" />
              <span>View students</span>
            </a>
          </div>
        </div>

        {/* Lecturer Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Lecturer Management</h4>
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/add-lecturer.png" alt="Add Lecturer" className="w-5 h-5" />
              <span>Add Lecturer</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/view-lecturers.png" alt="View lecturers" className="w-5 h-5" />
              <span>View lecturers</span>
            </a>
          </div>
        </div>

        {/* Payment Management Section */}
        <div className="mb-6">
          <h4 className="text-gray-300 text-sm font-medium mb-3 px-2">Payment Management</h4>
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/add-payment.png" alt="Add Payment" className="w-5 h-5" />
              <span>Add Payment</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#253d90] transition-colors"
            >
              <img src="/images/view-payments.png" alt="View payments" className="w-5 h-5" />
              <span>View payments</span>
            </a>
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

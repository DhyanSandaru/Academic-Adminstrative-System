import React, { useState } from "react";
import {
  Menu,
  LayoutDashboard,
  Calendar,
  UserPlus,
  Users,
  UserCheck,
  Users as UsersIcon,
  CreditCard,
  FileText,
  LogOut,
  Plus,
} from "lucide-react";
export default function AddPayment() {
  const [activeItem, setActiveItem] = useState("Add Payment");

  const menuItems = [
    {
      category: "Features",
      items: [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Time table", icon: Calendar },
      ],
    },
    {
      category: "Student Management",
      items: [
        { name: "Add student", icon: UserPlus },
        { name: "View students", icon: Users },
      ],
    },
    {
      category: "Lecturer Management",
      items: [
        { name: "Add Lecturer", icon: UserCheck },
        { name: "View Lecturers", icon: UsersIcon },
      ],
    },
    {
      category: "Payment Management",
      items: [
        { name: "Add Payment", icon: CreditCard },
        { name: "View Payments", icon: FileText },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#e3edf9]">
     

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        

        {/* Form Section */}
        <div className="flex-1 p-8">
          <div className="w-[700px] mx-auto bg-white rounded-lg shadow-sm p-8">

<form className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 space-y-6">
  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-2">Student Name :</label>
    <input
      type="text"
      className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-2">Student ID :</label>
    <input
      type="text"
      className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-2">Course Module :</label>
    <input
      type="text"
      className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-2">Lecturer :</label>
    <input
      type="text"
      className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-gray-700 font-medium mb-2">Amount :</label>
    <input
      type="number"
      className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
    />
  </div>

  <div className="flex justify-center">
    <button
      type="submit"
      className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-2 rounded"
    >
      Confirm
    </button>
  </div>
</form>

          </div>
        </div>
      </div>
    </div>
  );
}
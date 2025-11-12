"use client"
import React, { useState, useEffect } from "react";
import SearchBar from './Searchbar.jsx'
import { Download, ChevronDown, SlidersHorizontal, Layers } from "lucide-react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import TablePayment from "./PaymentTable.jsx";

export default function PaymentTable() {
  const [paymentData, setPaymentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [groupBy, setGroupBy] = useState("none");
  const [loading, setLoading] = useState(true);

  const exportPDF = (data) => {
    if (!data || data.length === 0) return; 
     
    const doc = new jsPDF(); 
    const headers = ["Name", "Student ID", "Date", "Time", "Course", "Lecturer", "Payment"];
    const rows = data.map(p =>
       [  p.student_name,
          p.student_id,
          new Date(p.created_at).toLocaleDateString(),
          new Date(p.created_at).toLocaleTimeString(), 
          p.course_module, p.lecturer, p.amount 
        ]); 
          
        autoTable(doc, {
           head: [headers],
          body: rows, 
          startY: 20, 
          styles: { fontSize: 10 }, 
          headStyles: { fillColor: [18, 28, 62] }, 
        }); 
        doc.save("payments.pdf"); 
   };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/payments");
        const data = await res.json();
        setPaymentData(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
      finally{
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter by search term
  const filteredData = paymentData.filter(item => 
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.course_module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data
  const sortData = (data) => {
    const sortedData = [...data];
    
    switch(sortBy) {
      case "date-newest":
        return sortedData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case "date-oldest":
        return sortedData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case "amount-high":
        return sortedData.sort((a, b) => b.amount - a.amount);
      case "amount-low":
        return sortedData.sort((a, b) => a.amount - b.amount);
      case "name-az":
        return sortedData.sort((a, b) => a.student_name.localeCompare(b.student_name));
      case "name-za":
        return sortedData.sort((a, b) => b.student_name.localeCompare(a.student_name));
      case "course":
        return sortedData.sort((a, b) => a.course_module.localeCompare(b.course_module));
      default:
        return sortedData;
    }
  };

  // Group data
  const groupData = (data) => {
    if (groupBy === "none") return { "All Payments": data };

    const grouped = {};
    
    data.forEach(payment => {
      let key;
      switch(groupBy) {
        case "course":
          key = payment.course_module;
          break;
        case "lecturer":
          key = payment.lecturer;
          break;
        case "student":
          key = payment.student_name;
          break;
        case "month":
          const date = new Date(payment.created_at);
          key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          break;
        case "date":
          key = new Date(payment.created_at).toLocaleDateString();
          break;
        default:
          key = "All";
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(payment);
    });

    return grouped;
  };

  const sortedData = sortData(filteredData);
  const groupedData = groupData(sortedData);

  // Calculate total for display
  const totalAmount = sortedData.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPayments = sortedData.length;

  return (
    <div className="min-h-[80vh] w-[75vw] flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg p-6">
      {/* Header Section with Stats */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Payment History</h2>
            <p className="text-sm text-gray-500">Manage and track all payment transactions</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-90">Total Payments</p>
              <p className="text-2xl font-bold">{totalPayments}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 mt-6">
          {/* Search Bar - Enhanced */}
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={() => {
                console.log(`Searching for: ${searchTerm}`)
              }}
            />
          </div>

          {/* Sort By Dropdown - Styled */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl group-hover:border-indigo-400 transition-all">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent text-gray-700 font-semibold text-sm cursor-pointer focus:outline-none pr-8"
                >
                  <option value="" disabled hidden>Sort By</option>
                  <optgroup label="📅 Date">
                    <option value="date-newest">Newest First</option>
                    <option value="date-oldest">Oldest First</option>
                  </optgroup>
                  <optgroup label="💰 Amount">
                    <option value="amount-high">High to Low</option>
                    <option value="amount-low">Low to High</option>
                  </optgroup>
                  <optgroup label="👤 Name">
                    <option value="name-az">A to Z</option>
                    <option value="name-za">Z to A</option>
                  </optgroup>
                  <optgroup label="📚 Other">
                    <option value="course">Course</option>
                  </optgroup>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Group By Dropdown - Styled */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
            <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl group-hover:border-purple-400 transition-all">
                <Layers className="w-4 h-4 text-purple-600" />
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="appearance-none bg-transparent text-gray-700 font-semibold text-sm cursor-pointer focus:outline-none pr-8"
                >
                  <option value="" disabled hidden>Group By</option>
                  <option value="none">🔄 None</option>
                  <option value="course">📚 Course</option>
                  <option value="lecturer">👨‍🏫 Lecturer</option>
                  <option value="student">👤 Student</option>
                  <option value="month">📅 Month</option>
                  <option value="date">📆 Date</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Export Button - Enhanced */}
          <button 
            className="relative group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
            onClick={() => {exportPDF(sortedData)}} 
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Download className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Export PDF</span>
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || sortBy !== "date-newest" || groupBy !== "none") && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">Active Filters:</span>
            {searchTerm && (
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                Search: "{searchTerm}"
              </span>
            )}
            {sortBy !== "date-newest" && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                Sort: {sortBy.replace('-', ' ')}
              </span>
            )}
            {groupBy !== "none" && (
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                Group: {groupBy}
              </span>
            )}
            <button 
              onClick={() => {
                setSearchTerm("");
                setSortBy("date-newest");
                setGroupBy("none");
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold ml-2 hover:underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Display grouped data */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {Object.entries(groupedData).map(([groupName, payments]) => (
          <div key={groupName} className="bg-white rounded-xl shadow-md overflow-hidden">
            {groupBy !== "none" && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="bg-white/20 px-3 py-1 rounded-lg">{groupName}</span>
                </h3>
                <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold">
                  {payments.length} payment{payments.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="p-4">
              <TablePayment payments={payments} />
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-indigo-600 font-semibold">Loading payments...</p>
          </div>
        </div>
      )}
    </div>
  );
}
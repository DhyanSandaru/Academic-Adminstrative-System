"use client"
import React, { useState, useEffect } from "react";
import SearchBar from './Searchbar.jsx'
import { Download } from "lucide-react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

export default function PaymentTable() {
  const [paymentData, setPaymentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRange, setSearchRange] = useState("All");
  const [loading,setLoading] = useState(true);

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

  const filteredData = paymentData.filter(item => 
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[80vh] w-[75vw] flex flex-col items-center bg-white rounded -xl">
      <div className="flex flex-row w-full items-end justify-around m-7 bg-white">
        <h2 className="text-black text-2xl">Payment History</h2>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={()=> {
            console.log(`Searcing for : ${searchTerm}`)
          }}
        />
        <button className="bg-green-600 text-white flex flex-row justify-center items-center gap-3 transition-transform duration-200 ease-in-out hover:scale-105"
          onClick={() => {exportPDF(filteredData)}} 
        >
          Export <Download className="text-white" />
        </button>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto shadow-2xl w-full rounded-lg">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-[#253d90]">
              <th className="py-3 px-4 text-center font-semibold text-white">Name</th>
              <th className="py-3 px-4 text-center font-semibold text-white">Student ID</th>
              <th className="py-3 px-4 text-center font-semibold text-white">Date</th>
              <th className="py-3 px-4 text-center font-semibold text-white">Time</th>
              <th className="py-3 px-4 text-center font-semibold text-white">Course</th>
              <th className="py-3 px-4 text-center font-semibold text-white">Lecturer</th>
              <th className="py-3 px-4 text-center font-semibold text-white">Payment</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Table Body */}
      <div className="overflow-y-auto flex-1 overflow-x-auto w-full rounded-lg">
        <table className="w-full table-fixed">
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((payment, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#f8f9fa]"} border-b hover:bg-gray-100 transition duration-150 ease-in-out`}
                >
                  <td className="py-3 px-4 font-medium text-[#121c3e]">{payment.student_name}</td>
                  <td className="py-3 px-4 text-[#121c3e]">{payment.student_id}</td>
                  <td className="py-3 px-4 text-[#121c3e]">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-[#121c3e]">
                    {new Date(payment.created_at).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-[#121c3e]">{payment.course_module}</td>
                  <td className="py-3 px-4 text-[#121c3e]">{payment.lecturer}</td>
                  <td className="py-3 px-4 text-[#121c3e] font-medium">{payment.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-[#121c3e]">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

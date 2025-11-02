"use client"
import React, { useState, useEffect } from "react";
import SearchBar from './Searchbar.jsx'
import { Download } from "lucide-react";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import TablePayment from "./PaymentTable.jsx";

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

      <TablePayment payments={filteredData}/>
    </div>
  );
}

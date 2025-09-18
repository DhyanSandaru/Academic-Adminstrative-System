import React, { useState, useEffect } from "react";
import SearchBar from "./Searchbar";

export default function PaymentView() {
  const [paymentData, setPaymentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/payments");
        const data = await res.json();
        setPaymentData(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, []);

  const filteredData = paymentData.filter((item) =>
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#e3edf9] p-6">
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={() => {
          console.log("Search for:", searchTerm);
        }}
      />

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#121c3e] text-white text-left">
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Student ID</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Time</th>
              <th className="py-3 px-4 font-semibold">Course</th>
              <th className="py-3 px-4 font-semibold">Payment</th>
            </tr>
          </thead>
          <tbody className="bg-white text-[#121c3e]">
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition duration-150 ease-in-out"
              >
                <td className="py-3 px-4">{item.student_name}</td>
                <td className="py-3 px-4">{item.student_id}</td>
                <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">{new Date(item.created_at).toLocaleTimeString()}</td>
                <td className="py-3 px-4">{item.course_module}</td>
                <td className="py-3 px-4">{item.amount}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-[#121c3e]">
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

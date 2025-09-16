import React, { useState } from "react";
import { Samplepayments } from "./PaymentData";

const paymentData = Samplepayments

export default function ViewPayment() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = paymentData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#e3edf9] p-[30px]">

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-[10px] w-[300px] mb-[20px] border border-[#ccc] rounded"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white">
          <thead style={{ backgroundColor: "#e3edf9" }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Student ID</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.studentId}</td>
                <td style={tdStyle}>{item.date}</td>
                <td style={tdStyle}>{item.time}</td>
                <td style={tdStyle}>{item.course}</td>
                <td style={tdStyle}>{item.payment}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="py-5 text-center text-[#121c3e]">
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

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#121c3e",
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  color: "#121c3e",
};

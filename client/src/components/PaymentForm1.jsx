import React, { useState } from "react";
import { Menu, Plus } from "lucide-react";

export default function PaymentForm1() {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [courseModule, setCourseModule] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPayment = { studentName, studentId, courseModule, lecturer, amount };

    try {
      const response = await fetch("http://localhost:8000/api/payments", { // ✅ Correct port & route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPayment),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setStudentName("");
        setStudentId("");
        setCourseModule("");
        setLecturer("");
        setAmount("");
      } else {
        alert(result.error || "Failed to add payment.");
      }
    } catch (err) {
      console.error("Error adding payment:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex h-screen bg-[#e3edf9]">
      <div className="flex-1 flex flex-col">
        
        <div className="flex-1 p-8">
          <div className="w-[700px] mx-auto bg-white rounded-lg shadow-sm p-8">
            <form
              className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Student Name :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Student ID :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Course Module :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  value={courseModule}
                  onChange={(e) => setCourseModule(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Lecturer :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Amount :</label>
                <input
                  type="number"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
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

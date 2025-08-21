import React, { useState } from "react";
import { Samplepayments } from "./sampleData";

const CalculateSalary = () => {
  // Mock data for lecturers and courses
  const lecturers = ["John Doe", "Jane Smith", "Alex Brown"];
  const courses = ["Chemistry", "Physics", "Math"];


  const payments = Samplepayments;

  const [lecturer, setLecturer] = useState("");
  const [course, setCourse] = useState("");
  const [cut, setCut] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    // Filter payments for selected lecturer & course
    const filteredPayments = payments.filter(
      (p) => p.lecturer === lecturer && p.course === course
    );

    const totalPaymentsCount = filteredPayments.length;
    const totalPaymentsSum = filteredPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    const lecturerSalary = (totalPaymentsSum * (cut / 100)).toFixed(2);

    setResult({
      totalPaymentsCount,
      totalPaymentsSum,
      lecturerSalary,
    });
  };

  return (
    <div className="p-4 border rounded-lg w-80 text-black bg-white">
      <h2 className="text-lg font-bold mb-4">Calculate Salary</h2>

      {/* Lecturer Dropdown */}
      <label className="block mb-2">Lecturer:</label>
      <select
        className="border rounded-lg p-2 w-full mb-3"
        value={lecturer}
        onChange={(e) => setLecturer(e.target.value)}
      >
        <option value="">Select Lecturer</option>
        {lecturers.map((lec) => (
          <option key={lec} value={lec}>
            {lec}
          </option>
        ))}
      </select>

      {/* Course Dropdown */}
      <label className="block mb-2">Course:</label>
      <select
        className="border p-2 w-full mb-3 rounded-lg"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Lecturer Cut */}
      <label className="block mb-2">Lecturer's Cut (%)</label>
      <input
        type="number"
        min="1"
        max="100"
        className="border rounded-lg p-2 w-full mb-4"
        value={cut}
        onChange={(e) => setCut(e.target.value)}
      />

      <button
        onClick={handleCalculate}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={!lecturer || !course || !cut}
      >
        Calculate
      </button>

      {/* Results */}
      {result && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <p>
            <strong>Total Payments:</strong> {result.totalPaymentsCount}
          </p>
          <p>
            <strong>Total Amount:</strong> Rs. {result.totalPaymentsSum}
          </p>
          <p>
            <strong>Lecturer Salary:</strong> Rs. {result.lecturerSalary}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalculateSalary;

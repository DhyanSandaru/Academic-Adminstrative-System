import React, { useEffect, useState } from "react";
import PaymentReceipt from "./PaymentReceipt"; // import the modal
import axios from "axios";
import { Link } from 'react-router-dom';
import { User, DollarSign, BookOpen, Users, FileText } from 'lucide-react';

export default function PaymentForm1() {

  const [receiptData, setReceiptData] = useState(null);
  const [fetchedData,setFetchedData] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showIdSuggestions, setShowIdSuggestions] = useState(false);
  const[formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    courseModule: "",
    lecturer: "",
    lecturer_id: "",
    amount: ""
  })
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableLecturers, setAvailableLecturers] = useState([]);

  
  useEffect(()=> {
    const fetchData =async ()=>{
      try{
        const response = await axios.get("http://localhost:8000/api/students/view-students")
        const validatedData = response.data.map(student => ({
          studentName: student.name,
          studentId: student.studentId,
          courses: student.courses
        }))

        setFetchedData(validatedData);
      }
      catch(err){
         if (err.response) {
          const status = err.response.status;
          const message = err.response.data?.message || "Server responded with an error";
          console.error(`Server Error (${status}): ${message}`);
          alert(message);
        } else if (err.request) {
          console.error("No response from server. Possible network or CORS issue.");
          alert("Network error or no response from server.");
        } else {
          console.error("Frontend error:", err.message);
          alert("Something went wrong on the frontend.");
        }
      }
    }
    fetchData();
  },[])

  const handleChange = (e) => {
    const{name,value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/payments/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Success: prepare receipt data
        setReceiptData({
          studentName :formData.studentName,
          studentId: formData.studentId,
          courseModule: formData.courseModule,
          lecturer: formData.lecturer,
          amount: formData.amount,
          refNo: result.ref_no || "N/A",
          createdAt: new Date().toISOString(),
        });

        // Clear form
        setFormData({
          studentName: "",
          studentId: "",
          courseModule:"",
          lecturer:"",
          lecturer_id: "",
          amount:""
        })
      } else {
        alert(result.error || "Failed to add payment.");
      }
    } catch (err) {
      console.error("Error adding payment:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {receiptData && (
        <PaymentReceipt data={receiptData} onClose={() => setReceiptData(null)} />
      )}

      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Record Payment</h1>
            <p className="text-gray-600">Enter payment details for student course modules</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Student Name Field */}
              <div className="flex flex-col relative">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Student Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white"
                  name="studentName"
                  placeholder="Type student name..."
                  value={formData.studentName}
                  onChange={handleChange}
                  onFocus={() => setShowNameSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowNameSuggestions(false), 150)}
                  required
                />
                {showNameSuggestions && fetchedData.length > 0 && (
                  <div className="absolute text-black text-left top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-30 max-h-56 overflow-y-auto">
                    {fetchedData
                      .filter((item) =>
                        item.studentName
                          .toLowerCase()
                          .includes(formData.studentName.toLowerCase())
                      )
                      .map((item, index) => (
                        <p
                          key={index}
                          onMouseDown={() => {
                            setSelectedStudent(item);
                            setFormData({
                              ...formData,
                              studentName: item.studentName,
                              studentId: item.studentId,
                            });
                            setShowCoursePopup(true);
                          }}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{item.studentName}</span>
                          <span className="text-gray-500 ml-2 text-sm">({item.studentId})</span>
                        </p>
                      ))}
                  </div>
                )}
              </div>

              {/* Student ID Field */}
              <div className="flex flex-col relative">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Student ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white"
                  name="studentId"
                  placeholder="Type student ID..."
                  value={formData.studentId}
                  onChange={handleChange}
                  onFocus={() => setShowIdSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowIdSuggestions(false), 150)}
                  required
                />
                {showIdSuggestions && fetchedData.length > 0 && (
                  <div className="absolute text-black text-left top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto">
                    {fetchedData
                      .filter((item) =>
                        item.studentId
                          .toLowerCase()
                          .includes(formData.studentId.toLowerCase())
                      )
                      .map((item, index) => (
                        <p
                          key={index}
                          onMouseDown={() => {
                            setSelectedStudent(item);
                            setFormData({
                              ...formData,
                              studentName: item.studentName,
                              studentId: item.studentId,
                            });
                            setShowCoursePopup(true);
                          }}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{item.studentId}</span>
                          <span className="text-gray-500 ml-2 text-sm">({item.studentName})</span>
                        </p>
                      ))}
                  </div>
                )}
              </div>

              {/* Course Module Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Course Module
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white"
                  name="courseModule"
                  placeholder="Course module will be selected..."
                  value={formData.courseModule}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              {/* Lecturer Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Lecturer
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white"
                  name="lecturer"
                  placeholder="Lecturer will be selected..."
                  value={formData.lecturer}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>

              {/* Amount Field */}
              <div className="flex flex-col">
                <label className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white"
                  placeholder="Enter payment amount..."
                  value={formData.amount}
                  name="amount"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:shadow-lg active:scale-95 mt-8"
              >
                Confirm Payment
              </button>
            </form>
          </div>
        </div>

        {/* Course Selection Popup */}
        {showCoursePopup && selectedStudent && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
              {!selectedCourse ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Select Course Module
                  </h2>
                  <div className="space-y-2 mb-6">
                    {selectedStudent.courses.map((course, index) => (
                      <button
                        key={index}
                        onClick={async () => {
                          setSelectedCourse(course);
                          try {
                            const res = await axios.get(
                              `http://localhost:8000/api/lecturers/view-lecturers/${course}`
                            );
                            setAvailableLecturers(res.data);
                          } catch (err) {
                            alert("Failed to load lecturers.");
                          }
                        }}
                        className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 text-gray-900 font-medium transition-all duration-200"
                      >
                        📚 {course}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Course not listed? Add it from <Link to={`http://localhost:5173/view-students/${formData.studentId}`} className="text-blue-600 hover:underline font-semibold">here</Link>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Select Lecturer
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm">for "{selectedCourse}"</p>
                  <div className="space-y-2 mb-6">
                    {availableLecturers.length > 0 ? (
                      availableLecturers.map((lecturer, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setFormData({
                              studentName: selectedStudent.studentName,
                              studentId: selectedStudent.studentId,
                              courseModule: selectedCourse,
                              lecturer: lecturer.lecturer_name,
                              lecturer_id: lecturer.lecturer_id,
                              amount: "",
                            });
                            setShowCoursePopup(false);
                            setSelectedCourse(null);
                            setAvailableLecturers([]);
                          }}
                          className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 text-gray-900 font-medium transition-all duration-200"
                        >
                          👨‍🏫 {lecturer.lecturer_name}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600 py-4">No lecturers found for this course.</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      setAvailableLecturers([]);
                    }}
                    className="w-full text-blue-600 hover:text-blue-700 font-semibold py-2 text-sm transition-colors"
                  >
                    ← Back to Course Selection
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setShowCoursePopup(false);
                  setSelectedCourse(null);
                  setAvailableLecturers([]);
                }}
                className="mt-4 w-full text-gray-600 hover:text-gray-700 font-semibold py-2 text-sm transition-colors border-t pt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}




              
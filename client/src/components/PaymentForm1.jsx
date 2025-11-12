import React, { useEffect, useState } from "react";
import PaymentReceipt from "./PaymentReceipt"; // import the modal
import axios from "axios";
import { Link } from 'react-router-dom';

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
    amount: ""
  })
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCoursePopup, setShowCoursePopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableLecturers, setAvailableLecturers] = useState([]);

  
  useEffect(()=> {
    const fetchData =async ()=>{
      try{
        const response = await axios.get("http://localhost:8000/view-students")
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
      const response = await fetch("http://localhost:8000/payments", {
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

      <div className="flex h-screen bg-[#e3edf9]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="w-[700px] mx-auto bg-white rounded-lg shadow-sm p-8">
              <form
                className="max-w-2xl mx-auto space-y-6"
                onSubmit={handleSubmit}
              >
               <div className="flex flex-col relative">
                <label className="text-gray-700 font-medium mb-2">Student Name :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  onFocus={() => setShowNameSuggestions(true)}
                  onBlur={() => setShowNameSuggestions(false)}
                  required
                />
                 {showNameSuggestions && fetchedData.length > 0 && (
                    <div className="absolute text-black text-left top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md z-30 max-h-48 overflow-y-auto">
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
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {item.studentName} - {item.studentId}
                          </p>
                        ))}
                    </div>
                  )}

              </div>

              <div className="flex flex-col relative">
                <label className="text-gray-700 font-medium mb-2">
                    Student ID :
                </label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  onFocus={() => setShowIdSuggestions(true)}
                  onBlur={() => setShowIdSuggestions(false)}
                  required
                />
                {showIdSuggestions && fetchedData.length > 0 && (
                    <div className="absolute text-black text-left top-full left-0 w-full bg-white border border-gray-300 rounded shadow-md z-50 max-h-48 overflow-y-auto">
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
                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                          >
                            {item.studentId} - {item.studentName}
                          </p>
                        ))}
                    </div>
                  )}
                
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Course Module :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  name="courseModule"
                  value={formData.courseModule}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Lecturer :</label>
                <input
                  type="text"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  name="lecturer"
                  value={formData.lecturer}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">Amount :</label>
                <input
                  type="number"
                  className="border-b-2 border-gray-300 focus:outline-none focus:border-blue-700 py-2"
                  value={formData.amount}
                  name="amount"
                  onChange={handleChange}
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

             {showCoursePopup && selectedStudent && (
              <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                  {!selectedCourse ? (
                    <>
                      <h2 className="text-lg font-semibold mb-4 text-gray-700">
                        Select Course Module
                      </h2>
                      {selectedStudent.courses.map((course, index) => (
                        <button
                          key={index}
                          onClick={async () => {
                            setSelectedCourse(course);
                            try {
                              const res = await axios.get(
                                `http://localhost:8000/view-lecturers/${course}`
                              );
                              setAvailableLecturers(res.data);
                            } catch (err) {
                              alert("Failed to load lecturers.");
                            }
                          }}
                          className="w-full text-left px-4 py-2 my-1 bg-blue-400 rounded hover:bg-blue-500"
                        >
                          {course}
                        </button>
                      ))}
                      <p className="text-gray-500 text-sm">Is course not listed? add it from <Link to={`http://localhost:5173/view-students/${formData.studentId}`}>here</Link></p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-lg font-semibold mb-4 text-gray-700">
                        Select Lecturer for "{selectedCourse}"
                      </h2>
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
                                amount: "",
                              });
                              setShowCoursePopup(false);
                              setSelectedCourse(null);
                              setAvailableLecturers([]);
                            }}
                            className="w-full text-left px-4 py-2 my-1 bg-blue-400 rounded hover:bg-blue-500"
                          >
                            {lecturer.lecturer_name}
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No lecturers found.</p>
                      )}
                      <button
                        onClick={() => {
                          setSelectedCourse(null); // go back to course selection
                          setAvailableLecturers([]);
                        }}
                        className="mt-3 text-sm text-blue-500 hover:underline"
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
                    className="mt-4 text-sm text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}


            </div>
          </div>
        </div>
      </div>
    </>
  );
}




              
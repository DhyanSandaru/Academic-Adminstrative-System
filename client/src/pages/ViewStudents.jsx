import { useState, useEffect } from "react";
import Student from "../components/Student";
import Layout from "../components/Layout";
import SearchBar from '../components/Searchbar.jsx';
import axios from "axios";

const itemsPerPage = 10;

export default function ViewStudents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/view-students");
        const validatedData = response.data.map(student => ({
          name: student.name ?? '',
          id: student.studentId ?? '',
          profilePhoto: student.profilePhoto ?? '',
          payment_status: student.status ?? ''
        }));

        setStudentData(validatedData);
      } catch (err) {
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
    };

    fetchData();
  }, []);

  // Filter students by search term
  const filteredStudents = studentData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentStudents = filteredStudents.slice(start, end);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <Layout title="View Students">
      <div className="bg-white w-[80vw] p-4 flex flex-col justify-between rounded-xl">
        {/* 🔍 Search bar */}
         <div className="w-full flex justify-center mb-6">
          <SearchBar
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to page 1 on new search
            }}
            onSearch={() => {
              console.log("Searching for:", searchTerm);
            }}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {currentStudents.map((student, index) => (
            <Student
              key={index + start}
              name={student.name}
              studentId={student.id}
              courses="Chemistry, Maths"
              status={student.payment_status}
              profilePhoto={student.profilePhoto}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}

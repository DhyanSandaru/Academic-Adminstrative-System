import { useState,useEffect } from "react";
import Student from "../components/Student";
import Layout from "../components/Layout";
import axios from "axios";

// const studentData = [...Array(30).keys()];
const itemsPerPage = 10;

export default function ViewStudents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData,setStudentData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/view_students');
        const validatedData = response.data.map(student => ({
          name: student.name ?? '',
          id: student.studentId ?? '',
          profilePhoto: student.profilePhoto ?? '',
          payment_status: student.status ?? ''
        }));

        setStudentData(validatedData); 
      } catch (err) {
          // Axios received a response from the serveR
          if (err.response) {
            const status = err.response.status;
            const message = err.response.data?.message || "Server responded with an error";

            console.error(`Server Error (${status}): ${message}`);
            alert(message);
          } 
          // Request was made but no response received 
          else if (err.request) {
            console.error("No response from server. Possible network or CORS issue.");
            alert("Network error or no response from server.");
          } 
          // Something else happened 
          else {
            console.error("Frontend error:", err.message);
            alert("Something went wrong on the frontend.");
          }
        }
    };

  fetchData();
  }, []);


  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentStudents = studentData.slice(start, end);

  const totalPages = Math.ceil(studentData.length / itemsPerPage);

  return(
    <Layout title="View Students">
      <div className="bg-white w-[80vw] p-4 flex flex-col justify-between rounded-xl">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {currentStudents.map((student, index) => (
            <Student key={index + start} name={student.name} studentId={student.id} courses="Chemistry, Maths" status={student.payment_status} profilePhoto={student.profilePhoto}/>
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
  )
}


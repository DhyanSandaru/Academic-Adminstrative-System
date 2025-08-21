import { useState,useEffect } from "react";
import Student from "../components/Student";
import Layout from "../components/Layout";

// const studentData = [...Array(30).keys()];
const itemsPerPage = 10;

export default function ViewStudents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData,setStudentData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/view-students');
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        const validatedData = result.map(student => ({
          name: student.name ?? '',
          studentId: student.studentId ?? '',
          courses: student.courses ?? '',
          status: student.status ?? ''
        }));

        setStudentData(validatedData); 
      } catch (err) {
        alert("Error fetching data");
        console.log(err);
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
          <Student key={index + start} name={student.name} studentId={student.id} courses={student.courses} status={student.status}/>
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


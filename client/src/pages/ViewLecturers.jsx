import { useState } from "react";
import Lecturer from "../components/Lecturer";
import Layout from "../components/Layout";

const students = [...Array(30).keys()]; // simulate student data
const itemsPerPage = 10;

export default function ViewStudents() {
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentStudents = students.slice(start, end);

  const totalPages = Math.ceil(students.length / itemsPerPage);

  return(
    <Layout title="View Lecturers">
      <div className="bg-white w-[80vw] p-4 flex flex-col justify-between">
      <div className="grid grid-cols-5 gap-4">
        {currentStudents.map((_, index) => (
          <Lecturer key={index + start} />
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


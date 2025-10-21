import { useState, useEffect } from "react";
import Lecturer from "../components/Lecturer";
import Layout from "../components/Layout";
import axios from "axios";
import SearchBar from "../components/Searchbar.jsx";

const itemsPerPage = 10;

export default function ViewLecturers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lecturerData, setLecturerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/view-lecturers");

        const validatedData = response.data.map((lecturer) => ({
          name: lecturer.name ?? '',
          id: lecturer.lecturerId ?? '',
          profilePhoto: lecturer.profilePhoto ?? '',
          courses: lecturer.courses ?? ''
        }));

        setLecturerData(validatedData);
      } catch (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data?.message || "Server error";
          console.error(`Server Error (${status}): ${message}`);
          alert(message);
        } else if (err.request) {
          console.error("No response from server. Network or CORS issue.");
          alert("Network error or no response from server.");
        } else {
          console.error("Frontend error:", err.message);
          alert("Something went wrong.");
        }
      }
    };

    fetchLecturers();
  }, []);

  const filteredLecturers = lecturerData.filter(lecturer =>
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentLecturers = filteredLecturers.slice(start, end);
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);

  return (
    <Layout title="View Lecturers">
      <div className="bg-white w-[80vw] p-4 flex flex-col justify-between rounded-xl">

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
          {currentLecturers.map((lecturer, index) => (
            <Lecturer
              key={index + start}
              name={lecturer.name}
              lecturerId={lecturer.id} // Correct prop
              courses={lecturer.courses} // string of courses
              profilePhoto={lecturer.profilePhoto}
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

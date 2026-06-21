import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Layout from "../components/Layout";
import SearchBar from '../components/Searchbar.jsx';
import { BookOpen, Filter } from 'lucide-react';
import axios from "axios";

const itemsPerPage = 12;

export default function ViewCourses() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/courses/get-courses");
        
        // Validate and map course data
        const validatedData = response.data.map(course => ({
          module_id: course.module_id ?? '',
          name: course.name ?? '',
          lecturer: course.lecturer ?? 'Not Assigned',
          courseBanner: course.courseBanner ?? '',
          payment: course.payment ?? '',
          grade: course.grade ?? '',
          curriculum: course.curriculum ?? '',
          description: course.description ?? ''
        }));

        setCourseData(validatedData);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic based on selected field
  const filteredCourses = courseData.filter(course => {
    if (searchBy === "name") {
      return course.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchBy === "id") {
      return course.module_id.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchBy === "lecturer") {
      return course.lecturer.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentCourses = filteredCourses.slice(start, end);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleCourseClick = (moduleId) => {
    navigate(`/view-courses/${moduleId}`);
  };

  return (
    <Layout title="View Courses">
      <div className="bg-white w-[80vw] p-8 rounded-2xl shadow-lg">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BookOpen className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
              <p className="text-sm text-gray-500">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-8 border border-purple-100">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <SearchBar
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                onSearch={() => console.log("Searching for:", searchTerm)}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <Filter size={18} className="text-purple-600" />
              <select
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
                className="border-none bg-transparent text-gray-700 font-medium focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="name">Search by Name</option>
                <option value="id">Search by ID</option>
                <option value="lecturer">Search by Lecturer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Course Cards Grid */}
            {currentCourses.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500 font-medium">No courses found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentCourses.map((course, index) => (
                  <CourseCard
                    key={index + start}
                    name={course.name}
                    courseId={course.module_id}
                    lecturer={course.lecturer}
                    courseBanner={course.courseBanner}
                    onClick={() => handleCourseClick(course.module_id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                        currentPage === i + 1 
                          ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg scale-110" 
                          : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
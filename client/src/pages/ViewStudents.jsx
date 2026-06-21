import { useState, useEffect } from "react";
import Student from "../components/Student";
import Layout from "../components/Layout";
import SearchBar from '../components/Searchbar.jsx';
import { SlidersHorizontal, Layers, ChevronDown } from "lucide-react";
import axios from "axios";
import { FaUserGraduate } from "react-icons/fa6";

const itemsPerPage = 10;

export default function ViewStudents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData, setStudentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [sortBy, setSortBy] = useState("name-az");
  const [groupBy, setGroupBy] = useState("none");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/students/view-students");
        const validatedData = response.data.map(student => ({
          name: student.name ?? '',
          id: student.studentId ?? '',
          profilePhoto: student.profilePhoto ?? '',
          payment_status: student.payment_status ?? '',
          courses: student.courses ?? '',
          gender: student.gender ?? '',
          grade: student.grade ?? ''
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

  // Filter logic based on selected field
  const filteredStudents = studentData.filter(student => {
    if (searchBy === "name") {
      return student.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchBy === "id") {
      return student.id.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Sort data
  const sortData = (data) => {
    const sortedData = [...data];
    
    switch(sortBy) {
      case "name-az":
        return sortedData.sort((a, b) => a.name.localeCompare(b.name));
      case "name-za":
        return sortedData.sort((a, b) => b.name.localeCompare(a.name));
      case "id-asc":
        return sortedData.sort((a, b) => a.id.localeCompare(b.id));
      case "id-desc":
        return sortedData.sort((a, b) => b.id.localeCompare(a.id));
      case "status":
        return sortedData.sort((a, b) => a.payment_status.localeCompare(b.payment_status));
      default:
        return sortedData;
    }
  };

  // Group data
  const groupData = (data) => {
    if (groupBy === "none") return { "All Students": data };

    const grouped = {};
    
    data.forEach(student => {
      let key;
      switch(groupBy) {
        case "status":
          key = student.payment_status || "Unknown";
          break;
        case "grade":
          key = student.grade || "No Grade";
          break;
        case "gender":
          key = student.gender || "Not Specified";
          break;
        case "course":
          // Handle courses array - group by first course or "No Course"
          if (Array.isArray(student.courses) && student.courses.length > 0) {
            key = student.courses[0];
          } else if (typeof student.courses === 'string' && student.courses) {
            key = student.courses;
          } else {
            key = "No Course";
          }
          break;
        default:
          key = "All";
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(student);
    });

    return grouped;
  };

  const sortedData = sortData(filteredStudents);
  const groupedData = groupData(sortedData);

  // Calculate total for display
  const totalStudents = sortedData.length;

  return (
    <Layout title="View Students">
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-[80vw] rounded-3xl shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>

        {/* Header Section */}
        <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 m-4 border border-white/60">
          <div className="flex justify-start items-center mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg mx-3">
              <FaUserGraduate className="text-white w-6 h-6"/>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Student Directory</h2>
              <p className="text-sm text-gray-500 mt-1">Showing {totalStudents} student{totalStudents !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="flex-1 min-w-[250px]">
              <SearchBar
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                onSearch={() => console.log("Searching for:", searchTerm)}
              />
            </div>

            {/* Search By Dropdown */}
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-semibold text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all hover:border-gray-300"
            >
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
            </select>

            {/* Sort By Dropdown */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-60 blur transition-opacity"></div>
              <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl group-hover:border-indigo-400 transition-all">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent text-gray-700 font-semibold text-sm cursor-pointer focus:outline-none pr-6"
                  >
                    <option value="" disabled hidden>Sort By</option>
                    <option value="name-az">Name (A-Z)</option>
                    <option value="name-za">Name (Z-A)</option>
                    <option value="id-asc">ID (Ascending)</option>
                    <option value="id-desc">ID (Descending)</option>
                    <option value="status">Payment Status</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Group By Dropdown */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-60 blur transition-opacity"></div>
              <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl group-hover:border-purple-400 transition-all">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    className="appearance-none bg-transparent text-gray-700 font-semibold text-sm cursor-pointer focus:outline-none pr-6"
                  >
                    <option value="" disabled hidden>Group By</option>
                    <option value="none">None</option>
                    <option value="status">Payment Status</option>
                    <option value="grade">Grade</option>
                    <option value="gender">Gender</option>
                    <option value="course">Course</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || sortBy !== "name-az" || groupBy !== "none") && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-xs font-semibold text-gray-600">Active Filters:</span>
              {searchTerm && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                  Search: "{searchTerm}"
                </span>
              )}
              {sortBy !== "name-az" && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  Sort: {sortBy.replace('-', ' ')}
                </span>
              )}
              {groupBy !== "none" && (
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                  Group: {groupBy}
                </span>
              )}
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("name-az");
                  setGroupBy("none");
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Student Cards Display */}
        <div className="p-4 space-y-6">
          {Object.entries(groupedData).map(([groupName, students]) => {
            // Pagination for each group
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const currentStudents = students.slice(start, end);
            const totalPages = Math.ceil(students.length / itemsPerPage);

            return (
              <div key={groupName} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/60 hover:shadow-xl transition-all">
                {/* Group Header */}
                {groupBy !== "none" && (
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-4 flex items-center justify-between">

                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">{groupName}</span>
                    </h3>
                    <span className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                      {students.length} student{students.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Student Cards Grid */}
                <div className="p-6">
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center">
                    {currentStudents.map((student) => (
                      <Student
                        key={student.id}
                        name={student.name}
                        studentId={student.id}
                        courses={student.courses}
                        status={student.payment_status}
                        profilePhoto={student.profilePhoto}
                        gender={student.gender}
                      />
                    ))}
                  </div>

                  {/* Pagination for this group */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
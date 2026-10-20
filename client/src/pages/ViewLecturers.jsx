import { useState, useEffect, useCallback } from "react";
import Lecturer from "../components/Lecturer";
import Layout from "../components/Layout";
import axios from "axios";
import SearchBar from "../components/Searchbar.jsx";
import { SlidersHorizontal, Layers, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function ViewLecturers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lecturerData, setLecturerData] = useState([]);
  const [totalLecturers, setTotalLecturers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [sortBy, setSortBy] = useState("name-az");
  const [groupBy, setGroupBy] = useState("none");

  const fetchLecturers = useCallback(async (page, search, searchByField) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: ITEMS_PER_PAGE,
        ...(search && { search, searchBy: searchByField })
      });
      const response = await axios.get(`http://localhost:8000/api/lecturers/view-lecturers?${params}`);
      const { data, total, totalPages: tp } = response.data;

      const validatedData = data.map((lecturer) => ({
        name: lecturer.name ?? '',
        id: lecturer.lecturerId ?? '',
        profilePhoto: lecturer.profilePhoto ?? '',
        courses: lecturer.courses ?? [],
        subject: lecturer.subject ?? '',
        department: lecturer.department ?? ''
      }));

      setLecturerData(validatedData);
      setTotalLecturers(total);
      setTotalPages(tp);
    } catch (err) {
      if (err.response) {
        console.error(`Server Error (${err.response.status}):`, err.response.data?.message);
      } else {
        console.error("Network error:", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLecturers(currentPage, searchTerm, searchBy);
  }, [currentPage, fetchLecturers]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchLecturers(1, value, searchBy);
  };

  const handleSearchByChange = (value) => {
    setSearchBy(value);
    setCurrentPage(1);
    fetchLecturers(1, searchTerm, value);
  };

  // Client-side sort (on current page)
  const sortData = (data) => {
    const sortedData = [...data];
    switch (sortBy) {
      case "name-az": return sortedData.sort((a, b) => a.name.localeCompare(b.name));
      case "name-za": return sortedData.sort((a, b) => b.name.localeCompare(a.name));
      case "id-asc":  return sortedData.sort((a, b) => a.id.localeCompare(b.id));
      case "id-desc": return sortedData.sort((a, b) => b.id.localeCompare(a.id));
      default: return sortedData;
    }
  };

  // Client-side group (on current page)
  const groupData = (data) => {
    if (groupBy === "none") return { "All Lecturers": data };
    const grouped = {};
    data.forEach(lecturer => {
      let key;
      switch (groupBy) {
        case "course":
          key = Array.isArray(lecturer.courses) && lecturer.courses.length > 0
            ? lecturer.courses[0]
            : typeof lecturer.courses === 'string' && lecturer.courses
              ? lecturer.courses.split(',')[0].trim()
              : "No Course";
          break;
        case "subject":
          key = lecturer.subject || "No Subject";
          break;
        case "department":
          key = lecturer.department || "No Department";
          break;
        default:
          key = "All";
      }
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(lecturer);
    });
    return grouped;
  };

  const displayData = sortData(lecturerData);
  const groupedData = groupData(displayData);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
      acc.push(p);
      return acc;
    }, []);

  return (
    <Layout title="View Lecturers">
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 w-[80vw] rounded-3xl shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>

        {/* Header Section */}
        <div className="relative z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 m-4 border border-white/60">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Lecturer Directory</h2>
              <p className="text-sm text-gray-500 mt-1">
                {isLoading ? "Loading..." : `${totalLecturers} lecturer${totalLecturers !== 1 ? 's' : ''} total`}
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[250px]">
              <SearchBar
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onSearch={() => {}}
              />
            </div>

            <select
              value={searchBy}
              onChange={(e) => handleSearchByChange(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-semibold text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all hover:border-gray-300"
            >
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
            </select>

            {/* Sort By */}
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
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Group By */}
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
                    <option value="course">Course</option>
                    <option value="subject">Subject</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
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
                  setCurrentPage(1);
                  fetchLecturers(1, "", "name");
                }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Lecturer Cards */}
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            Object.entries(groupedData).map(([groupName, lecturers]) => (
              <div key={groupName} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/60 hover:shadow-xl transition-all">
                {groupBy !== "none" && (
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">{groupName}</span>
                    </h3>
                    <span className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                      {lecturers.length} on this page
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center">
                    {lecturers.map((lecturer, index) => (
                      <Lecturer
                        key={`${groupName}-${index}`}
                        name={lecturer.name}
                        lecturerId={lecturer.id}
                        courses={lecturer.courses}
                        profilePhoto={lecturer.profilePhoto}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Server-side Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pb-8 flex-wrap">
            <button
              id="lecturers-prev-page"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl font-semibold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {pageNumbers.map((item, idx) =>
              item === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">…</span>
              ) : (
                <button
                  key={item}
                  id={`lecturers-page-${item}`}
                  onClick={() => setCurrentPage(item)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    currentPage === item
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              id="lecturers-next-page"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded-xl font-semibold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-sm text-gray-500 ml-2">
              Page {currentPage} of {totalPages} · {totalLecturers} total
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
}
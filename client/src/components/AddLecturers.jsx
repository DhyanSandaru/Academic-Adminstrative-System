import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./Searchbar";
import { X } from "lucide-react";

export default function AddLecturers({ selectedLecturers, setSelectedLecturers, handleClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lecturerData, setLecturerData] = useState([]);

  // Fetch lecturers
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/view-lecturers");
        const validatedData = response.data.map((lecturer) => ({
          lecturerId: lecturer.lecturerId,
          lecturerName: lecturer.name,
          profilePhoto: lecturer.profilePhoto,
          email: lecturer.email,
          mobile: lecturer.mobile
        }));
        setLecturerData(validatedData);
      } catch (err) {
        if (err.response) {
          console.error("Server error:", err.response.status, err.response.data);
        } else if (err.request) {
          console.error("No response received", err.request);
        } else {
          console.error("Error:", err.message);
        }
      }
    };
    fetchLecturers();
  }, []);

  
  const selectLecturer = (lecturerName, lecturerId,profilePhoto,email,mobile) => {
    // Check if lecturer already exists by comparing lecturerId
    const alreadySelected = selectedLecturers.some(
      (lecturer) => lecturer.lecturerId === lecturerId
    );
    
    if (!alreadySelected) {
      const newLecturer = {
        lecturer_name: lecturerName,
        lecturer_id: lecturerId,
        profile_photo: profilePhoto,
        email: email,
        mobile: mobile
      };
      setSelectedLecturers([...selectedLecturers, newLecturer]);
    }
  };

  // Remove lecturer - Fixed to filter by lecturerId
  const removeLecturer = (lecturerId) => {
    setSelectedLecturers(
      selectedLecturers.filter((item) => item.lecturer_id !== lecturerId)
    );
  };

  // Filter search results
  const filteredLecturers = lecturerData.filter((item) =>
  (item.lecturerName || "").toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="rounded-2xl shadow-md bg-white p-10 text-black z-10 backdrop-blur-lg w-full max-w-3xl mx-auto relative">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 rounded-full hover:bg-gray-200 transition"
      >
        <img src="/images/x.png" alt="close" className="w-3" />
      </button>

      <h2 className="text-xl font-semibold mb-4 text-center">Select Lecturers</h2>

      {/* Selected lecturers - FIXED */}
      <div className="flex flex-wrap gap-2 justify-start items-center border-b-2 border-gray-300 mb-5 pb-3">
        <p className="font-medium w-full text-gray-700">Added Lecturers:</p>
        {Array.isArray(selectedLecturers) && selectedLecturers.length > 0 ? (
          selectedLecturers.map((lecturer, index) => (
            <div
              key={index}
              className="bg-white border-1 border-black hover:bg-gray-200 text-black py-1 px-3 rounded-md flex items-center justify-between gap-2"
            >
              <div className="flex flex-col text-start">
                <h2 className="text-md">Name :{lecturer.lecturer_name}</h2>
                <p className="text-sm">ID :{lecturer.lecturer_id}</p>
              </div>
              <button
                type="button"
                onClick={() => removeLecturer(lecturer.lecturer_id)}
                className="hover:bg-gray-300 rounded-full "
              >
                <X size={18} />
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400 text-sm italic">No lecturers selected yet</span>
        )}
      </div>

      {/* Search bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={() => console.log(`Searching for ${searchTerm}`)}
      />

      {/* Lecturer list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredLecturers.length > 0 ? (
          filteredLecturers.map((lecturer, index) => (
            <button
              key={index}
              className="rounded-xl shadow-md flex flex-row justify-around items-center w-full p-3 bg-white hover:bg-gray-100 text-black transition"
              onClick={() => selectLecturer(lecturer.lecturerName, lecturer.lecturerId, lecturer.profilePhoto, lecturer.email, lecturer.mobile)}
            >
              <img
                src={
                  lecturer.profilePhoto 
                    ? `http://localhost:8000${lecturer.profilePhoto}` 
                    : '/images/default_user.png'
                }
                alt={lecturer.lecturerName}
                className="w-15 h-15 object-cover rounded-full"
              />
              <div>
                <h3 className="font-semibold mb-2">{lecturer.lecturerName}</h3>
                <h2 className="text-sm">{lecturer.lecturerId}</h2>
              </div>
            </button>
          ))
        ) : (
          <div className="text-gray-500 text-sm col-span-full text-center">
            No lecturers found for "<strong>{searchTerm}</strong>"
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import SearchBar from "./Searchbar";
import { useEffect } from "react";
import axios from "axios";
import { X } from 'lucide-react'
import { BACKEND_URL } from "./config";

export default function AddCourses({selectedCourses, setSelectedCourses, handleClose}){
    const [searchTerm,setSearchTerm] = useState("");
    const [courseData,setCourseData] = useState([]);

    const selectCourse = (moduleName) => {
        if (!selectedCourses.includes(moduleName)) {
            setSelectedCourses([...selectedCourses, moduleName]);
        }
    }

    const removeCourse = (module) => {
        setSelectedCourses(selectedCourses.filter((item) => item !== module))
    }

    useEffect( () => {
        const fetchCourses = async () => {
            try{    
            const response =  await axios.get(`${BACKEND_URL}/get-courses`);
            const validatedData = response.data.map((course) => ({
                courseName: course.name,
                courseId: course.module_id,
                lecturer: course.lecturer_name
            }))
            setCourseData(validatedData);
        }
        catch(err){
            if (err.response) {
                // server responded with a status != 2xx
                console.error("Server error:", err.response.status, err.response.data);
            } else if (err.request) {
                // request made but no response received
                console.error("No response received", err.request);
            } else {
                // anything else
                console.error("Error:", err.message);
            }
        }
        }
        fetchCourses();
        
    }, [])

    const filteredData = courseData.filter((item) => 
        item.courseName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <div className="rounded-2xl shadow-md w-2xl bg-white p-10 text-black z-10 backdrop-blur-lg">
             <button
                onClick={handleClose}
                className="absolute top-2 right-2 rounded-full"
            >
                <X className="text-black"/>
            </button>
            <h2>Select courses</h2>
            <div className="flex justify-between border-b-2 border-gray-300 m-5 p-3">
                <p>Added Courses :</p>
                {Array.isArray(selectedCourses) &&selectedCourses.map((module,index) => (
                  <div
                    key={index}
                    className="bg-[#253d90] hover:bg-[#1e2f7a] text-white py-1 rounded-md flex items-center pl-2"
                  >
                    {module}
                    <button
                      type="button"
                      onClick={() => removeCourse(module)}
                      className="hover:bg-white/20 rounded-full"
                    >
                      <img src="\images\x.png" alt="close" className="w-3"/>
                    </button>
                  </div>
                ))}
            </div>

             <SearchBar 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={()=>{
                    console.log(`Searching for ${searchTerm}`)
                }}

             />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {filteredData.length > 0 ? (
                    filteredData.map((course, index) => (
                    <button 
                        key={index}
                        className="rounded-xl shadow-md flex flex-col justify-start w-full p-3 bg-blue-600 text-white"
                        onClick={() => selectCourse(course.courseName)}
                    >
                        <h3 className="font-semibold mb-3">{course.courseName}</h3>
                        <span>Module ID: {course.courseId}</span>
                        <span>Lecturer: {course.lecturer}</span>
                    </button>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm col-span-2">
                    No courses found for "<strong>{searchTerm}</strong>"
                    </div>
                )}
            </div>


        </div>
    )
    
}
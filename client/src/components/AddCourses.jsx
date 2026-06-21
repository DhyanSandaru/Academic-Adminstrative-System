import { useState } from "react";
import SearchBar from "./Searchbar";
import { useEffect } from "react";
import axios from "axios";

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
            const response =  await axios.get(`http://localhost:8000/api/courses/get-courses`);
            const validatedData = response.data.map((course) => ({
                courseName: course.name,
                courseId: course.module_id,
                lecturer: course.lecturer,
                grade: course.grade
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
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-2xl shadow-lg w-full max-w-4xl bg-white p-8 text-black relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-200 transition-colors"
                >
                    <img src="\images\x.png" alt="close" className="w-4 h-4"/>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Select Courses</h2>
                <div className="border-b-2 border-gray-300 pb-4 mb-6">
                    <p className="text-lg font-medium mb-3">Added Courses:</p>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedCourses) && selectedCourses.map((module, index) => (
                            <div
                                key={index}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <span className="text-sm font-medium">{module}</span>
                                <button
                                    type="button"
                                    onClick={() => removeCourse(module)}
                                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                >
                                    <img src="\images\x.png" alt="remove" className="w-3 h-3"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <SearchBar 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onSearch={() => {
                        console.log(`Searching for ${searchTerm}`)
                    }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {filteredData.length > 0 ? (
                        filteredData.map((course, index) => (
                            <button 
                                key={index}
                                className="rounded-xl shadow-md hover:shadow-lg flex flex-col justify-start w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 transform hover:scale-105"
                                onClick={() => selectCourse(course.courseName)}
                            >
                                <h3 className="font-semibold text-lg mb-2">{course.courseName}</h3>
                                <div className="text-sm">
                                    <p>Module ID: {course.courseId}</p>
                                    <p>Lecturer: {course.lecturer}</p>
                                    <p>Grade :{course.grade}</p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center col-span-full py-8">
                            No courses found for "<strong>{searchTerm}</strong>"
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
    
}
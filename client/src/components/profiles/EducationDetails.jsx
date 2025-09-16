import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import studentContext from './StudentContext.jsx'; // adjust path if needed

export default function EducationDetails() {
  const { studentData, setStudentData } = useContext(studentContext);

  const [formData, setFormData] = useState({
    examYear: '',
    courses: ''
  });

  const [originalData, setOriginalData] = useState(null);

  // Initialize form data when studentData is available
  useEffect(() => {
    if (studentData) {
      const formatted = {
        examYear: studentData.examYear || '',
        courses: studentData.courses?.join(', ') || ''
      };
      setFormData(formatted);
      setOriginalData(formatted);
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Rebuild courses array from comma-separated input
      const updatedCourses = formData.courses
        .split(',')
        .map(course => course.trim())
        .filter(course => course.length > 0);

      const updatedData = {
        ...studentData,
        examYear: formData.examYear,
        courses: updatedCourses
      };

      const response = await axios.put(
        `http://localhost:8000/view_students/${studentData.studentId}`,
        updatedData
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Education details updated successfully');
        setStudentData(updatedData);
        setOriginalData(formData);
      } else {
        alert('Failed to update');
        setFormData(originalData);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error while updating education details.');
      setFormData(originalData);
    }
  };

  if (!studentData) return <p>Loading...</p>;

  return (
    <div className='flex flex-col gap-6 bg-white w-full pt-20 pb-30 rounded-lg shadow-md'>
      <h2 className='text-lg'>Education Details</h2>

      {/* Exam Year */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Exam Year</p>
        <input
          type="text"
          name="examYear"
          value={formData.examYear}
          onChange={handleChange}
          className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
        />
      </div>

      {/* Courses */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Enrolled Courses</p>
        <input
          type="text"
          name="courses"
          value={formData.courses}
          onChange={handleChange}
          className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
        />
      </div>

      <button
        onClick={handleUpdate}
        className='bg-green-500 mt-5 ml-4 w-30 duration-300 ease-out transform hover:scale-105 hover:bg-green-600 text-white py-2 px-6 rounded'
      >
        Update
      </button>
    </div>
  );
}

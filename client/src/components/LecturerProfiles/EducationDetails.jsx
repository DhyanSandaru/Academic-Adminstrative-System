import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import lecturerContext from './LecturerContext.jsx'; // adjust path if needed

export default function LecturerEducationDetails() {
  const { lecturerData, setLecturerData } = useContext(lecturerContext);

  const [formData, setFormData] = useState({
    examYear: '',
    qualifications: '',
    teachingModules: ''
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (lecturerData) {
      const formatted = {
        examYear: lecturerData.examYear || '',
        qualifications: lecturerData.qualifications || '',
        teachingModules: lecturerData.courses?.join(', ') || ''
      };
      setFormData(formatted);
      setOriginalData(formatted);
    }
  }, [lecturerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedModules = formData.teachingModules
        .split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0);

      const updatedData = {
        ...lecturerData,
        examYear: formData.examYear,
        qualifications: formData.qualifications,
        courses: updatedModules
      };

      const response = await axios.put(
        `http://localhost:8000/view_lecturers/${lecturerData.lecturerId}`,
        updatedData
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Education details updated successfully');
        setLecturerData(updatedData);
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

  if (!lecturerData) return <p>Loading...</p>;

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

      {/* Qualifications */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Qualifications</p>
        <input
          type="text"
          name="qualifications"
          value={formData.qualifications}
          onChange={handleChange}
          className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
        />
      </div>

      {/* Teaching Modules */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Teaching Modules (comma-separated)</p>
        <input
          type="text"
          name="teachingModules"
          value={formData.teachingModules}
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

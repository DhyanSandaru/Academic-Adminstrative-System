import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import lecturerContext from './LecturerContext';

export default function LecturerProfile() {
  const { lecturerData, setLecturerData } = useContext(lecturerContext);

  const [formData, setFormData] = useState({
    name: '',
    lecturerId: '',
    nic: '',
    gender: '',
    profilePhoto: ''
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (lecturerData) {
      const formatted = {
        name: lecturerData.name,
        lecturerId: lecturerData.lecturerId,
        nic: lecturerData.nic,
        gender: lecturerData.gender,
        profilePhoto: lecturerData.profilePhoto
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
      const response = await axios.put(
        `http://localhost:8000/view-lecturers/${lecturerData.lecturerId}`,
        formData
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Lecturer details updated successfully');
        setLecturerData(formData);
        setOriginalData(formData);
      } else {
        alert('Failed to update');
        setFormData(originalData);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error while updating lecturer details.');
      setFormData(originalData);
    }
  };

  if (!lecturerData) return <p>Loading...</p>;

  return (
    <div className="pt-15 pb-30 bg-white w-full rounded-lg shadow-md">
      <h2 className='text-lg'>Personal Details</h2>

      {/* Action Buttons */}
      <div className="flex justify-end mb-6 mr-5">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-2 text-white bg-green-500 py-1 px-3 rounded hover:bg-green-600 mr-3"
        >
          Save
        </button>
      </div>

      {/* Profile Section */}
      <div className="text-center mb-8">
        <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden">
          {formData.profilePhoto && (
            <img
              src={`http://localhost:8000${formData.profilePhoto}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Lecturer Name */}
        <div className="mb-2">
          <p className="text-sm font-medium mb-1 text-[#878585]">Lecturer Name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-blue-200 rounded-lg w-[30%] mx-auto p-2 outline-none text-center"
          />
        </div>

        {/* Lecturer ID (read-only) */}
        <div className="mb-2">
          <p className="text-sm font-medium mb-1 text-[#878585]">Lecturer ID</p>
          <input
            type="text"
            name="lecturerId"
            value={formData.lecturerId}
            readOnly
            className="bg-gray-300 rounded-lg w-[30%] mx-auto p-2 outline-none text-center cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 mt-4">
          <div className="text-center">
            <p className="text-sm font-medium mb-2 text-[#878585]">NIC</p>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className="bg-blue-200 rounded-lg w-[50%] mx-auto p-2 outline-none text-center"
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-2 text-[#878585]">Gender</p>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-blue-200 rounded-lg w-[50%] mx-auto p-2 outline-none text-center"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

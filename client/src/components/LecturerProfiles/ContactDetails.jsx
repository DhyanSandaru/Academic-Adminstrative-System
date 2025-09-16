import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import lecturerContext from './LecturerContext.jsx';

export default function LecturerContactDetails() {
  const { lecturerData, setLecturerData } = useContext(lecturerContext);

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: ''
  });

  const [originalData, setOriginalData] = useState(null);

  // Initialize form data when lecturerData is available
  useEffect(() => {
    if (lecturerData) {
      const formatted = {
        phone: lecturerData.mobile,
        email: lecturerData.email,
        address: lecturerData.address
      };
      setFormData(formatted);
      setOriginalData(formatted);
    }
  }, [lecturerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/view-lecturers/${lecturerData.lecturerId}`, lecturerData);

      if (response.status >= 200 && response.status < 300) {
        alert("Contact details updated successfully");

        // Update global context
        setLecturerData(prev => ({
          ...prev,
          mobile: formData.phone,
          email: formData.email,
          address: formData.address
        }));

        setOriginalData(formData);

      } else {
        alert("Failed to update");
        setFormData(originalData); // revert
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error while updating contact details.");
      setFormData(originalData); // revert
    }
  };

  if (!lecturerData) return <p>Loading...</p>;

  return (
    <div className='flex flex-col gap-6 pt-20 pb-30 bg-white w-full rounded-lg shadow-md'>
      <h2 className='text-lg'>Contact Details</h2>

      {/* Phone */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Phone Number</p>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
        />
      </div>

      {/* Email */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Email</p>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
        />
      </div>

      {/* Address */}
      <div className='flex flex-col justify-start m-3'>
        <p className='text-left ml-2'>Residential Address</p>
        <input
          type="text"
          name="address"
          value={formData.address}
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

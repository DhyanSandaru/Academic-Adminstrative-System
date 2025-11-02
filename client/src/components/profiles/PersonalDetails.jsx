// PersonalDetails.jsx (Optimized)
import { useContext, useEffect, useState } from 'react';
import studentContext from './StudentContext.jsx';
import { User } from 'lucide-react';

export default function PersonalDetails() {
  const { studentData, updateStudent, saving } = useContext(studentContext);

  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    gender: '',
    dob: '',
    ethnicity: '',
    profilePhoto: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (studentData) {
      const initialData = {
        name: studentData.name || '',
        nic: studentData.nic || '',
        gender: studentData.gender || '',
        dob: studentData.dob || '',
        ethnicity: studentData.ethnicity || '',
        profilePhoto: studentData.profilePhoto || ''
      };
      setFormData(initialData);
      if (initialData.profilePhoto) {
        setPreviewUrl(`http://localhost:8000${initialData.profilePhoto}`);
      }
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    const result = await updateStudent(formData, photoFile);
    if (result.success) {
      alert('Personal details updated successfully');
      setHasChanges(false);
      setPhotoFile(null);
    } else {
      alert(result.message);
    }
  };

  return (
    <div id="personal-details" className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">Personal Details</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <User size={60} className="text-white" />
                </div>
              )}
            </div>
            <input
              type="file"
              id="photoUpload"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <label
            htmlFor="photoUpload"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            Change Photo
          </label>
        </div>

        {/* Student ID - Read Only */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            value={studentData.studentId}
            readOnly
            className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg text-center font-semibold text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">NIC Number</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ethnicity</label>
            <input
              type="text"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
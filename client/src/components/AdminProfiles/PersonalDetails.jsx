import { forwardRef } from "react";
import { User } from "lucide-react";

const PersonalDetails = forwardRef(
  ({ adminData, handleChange, handlePhotoChange, handleSave, previewUrl, saving }, ref) => {
    return (
      <div ref={ref} className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <User className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">Personal Details</h2>
          </div>
          
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-10">
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

            <label
              htmlFor="photoUpload"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              Change Photo
            </label>
          </div>

          <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin ID</label>
            <input
              type="text"
              value={adminData.id || ''}
              readOnly
              className="w-full p-3 bg-white border-2 border-blue-200 rounded-lg text-center font-semibold text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[95%] mx-auto">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={adminData.name || ''}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">NIC Number</label>
              <input
                type="text"
                name="nic"
                value={adminData.nic || ''}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={adminData.gender || ''}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default PersonalDetails;
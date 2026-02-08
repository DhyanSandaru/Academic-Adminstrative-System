import { forwardRef } from "react";
import { Phone } from "lucide-react";

const ContactDetails = forwardRef(({ adminData, handleChange, handleSave, saving }, ref) => {
  return (
    <div ref={ref} className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Phone className="text-white" size={28} />
          <h2 className="text-2xl font-bold text-white">Contact Details</h2>
        </div>
        
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[95%] mx-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              name="mobile"
              value={adminData.mobile || ''}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={adminData.email || ''}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={adminData.address || ''}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContactDetails;
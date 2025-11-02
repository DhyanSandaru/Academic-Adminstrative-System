import { useContext, useEffect, useState } from 'react';
import LecturerContext from './LecturerContext.jsx';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function LecturerContactDetails() {
  const { lecturerData, updateLecturer, saving } = useContext(LecturerContext);

  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    address: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (lecturerData) {
      setFormData({
        mobile: lecturerData.mobile || '',
        email: lecturerData.email || '',
        address: lecturerData.address || ''
      });
    }
  }, [lecturerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const result = await updateLecturer(formData);
    if (result.success) {
      alert('Contact details updated successfully');
      setHasChanges(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <div id='contact-details' className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="text-white" size={28} />
            <h2 className="text-2xl font-bold text-white">Contact Details</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone size={18} className="text-green-600" />
              Phone Number
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              placeholder="+94 XX XXX XXXX"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={18} className="text-green-600" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              placeholder="lecturer@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={18} className="text-green-600" />
              Residential Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors resize-none"
              placeholder="Enter full address"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
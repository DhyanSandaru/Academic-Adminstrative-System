import { useContext, useEffect, useState } from 'react';
import studentContext from './StudentContext.jsx';
import { Phone, Users } from 'lucide-react';

export default function ContactDetails() {
  const { studentData, updateStudent, saving } = useContext(studentContext);

  const [formData, setFormData] = useState({
    mobile: '',
    email: '',
    address: '',
    guardianName: '',
    guardianMobile: '',
    guardianRelation: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (studentData) {
      setFormData({
        mobile: studentData.mobile || '',
        email: studentData.email || '',
        address: studentData.address || '',
        guardianName: studentData.guardianName || '',
        guardianMobile: studentData.guardianMobile || '',
        guardianRelation: studentData.guardianRelation || ''
      });
    }
  }, [studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const result = await updateStudent(formData);
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
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Phone size={20} className="text-green-600" />
            Student Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="student@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Residential Address</label>
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

        <div className="border-t-2 border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Guardian Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Name</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian Mobile</label>
              <input
                type="text"
                name="guardianMobile"
                value={formData.guardianMobile}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship</label>
              <select
                name="guardianRelation"
                value={formData.guardianRelation}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="">Select Relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
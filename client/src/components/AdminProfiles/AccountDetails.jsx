import { forwardRef } from "react";
import { Lock } from "lucide-react";

const AccountDetails = forwardRef(({ adminData, handleChange }, ref) => {
  return (
    <div ref={ref} className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Lock className="text-white" size={28} />
          <h2 className="text-2xl font-bold text-white">Account Details</h2>
        </div>
      </div>

      <div className="p-8 w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
          <select
            name="accountStatus"
            value={adminData.accountStatus || 'Active'}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Last Login</label>
          <input
            type="text"
            name="lastLogin"
            value={adminData.lastLogin || 'Never'}
            readOnly
            className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
});

export default AccountDetails;
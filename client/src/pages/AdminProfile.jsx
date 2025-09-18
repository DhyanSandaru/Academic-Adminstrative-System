import { useState, useEffect } from "react";
import AddAdminForm from "./AdminForm.jsx";
import Layout from "../components/Layout.jsx"; 
import axios from "axios";

export default function AdminProfile() {
  const [showForm, setShowForm] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Fetch admin data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        // Replace 'admin123' with a dynamic username if needed
        const res = await axios.get("http://localhost:8000/api/admins/admin123");
        setAdminData(res.data);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchAdmin();
  }, []);

  return (
    <Layout title="Admin Profile">
      <div className="min-h-screen bg-[#e3edf9] p-6">
        {showForm ? (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-sm">
              <AddAdminForm />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex-1 max-w-4xl bg-white rounded-lg shadow p-8">
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-12 py-3 rounded-lg text-lg font-medium"
                >
                  Add Admin
                </button>
              </div>

              {/* Profile Section */}
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-white">
                  {adminData ? adminData.username.charAt(0).toUpperCase() : "A"}
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium mb-1 text-[#878585]">
                    Admin Username
                  </p>
                  <h2 className="text-2xl font-bold text-black">
                    {adminData ? adminData.username : "Loading..."}
                  </h2>
                </div>

                <div className="mb-8">
                  <p className="text-sm font-medium mb-1 text-[#878585]">
                    Role
                  </p>
                  <p className="text-xl font-bold text-black">Admin</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2 text-[#878585]">
                    Email
                  </p>
                  <p className="text-lg font-semibold text-black">
                    {adminData ? adminData.email : "Loading..."}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-2 text-[#878585]">
                    Contact No
                  </p>
                  <p className="text-lg font-semibold text-black">
                    +94 71 234 5678
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

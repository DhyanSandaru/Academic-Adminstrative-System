import { useState } from "react";
import axios from "axios";

export default function AddAdminForm() {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
const formData = new FormData();

formData.append("adminName", form["admin-name"].value);
formData.append("email", form["email"].value);
formData.append("password", form["password"].value);
formData.append("profilePhoto", profilePhoto); // optional, backend ignores this

try {
  const res = await axios.post(
    "http://localhost:8000/api/add-admin",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  alert(res.data.message || "Admin added successfully!");
  form.reset();
  setProfilePhoto(null);
} catch (err) {
  if (err.response?.data?.message) alert(err.response.data.message);
  else alert("Submission Failed");
}
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Admin Name */}
          <div className="flex items-center gap-8">
            <label htmlFor="admin-name" className="w-40 text-[#000000] font-medium">
              Admin Name :
            </label>
            <div className="flex-1">
              <input
                id="admin-name"
                name="admin-name"
                required
                className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex items-center gap-8">
            <label htmlFor="profile-photo" className="w-40 text-[#000000] font-medium">
              Profile Photo :
            </label>
            <div className="flex-1 flex items-center gap-4">
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-60"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-8">
            <label htmlFor="email" className="w-40 text-[#000000] font-medium">
              Email :
            </label>
            <div className="flex-1">
              <input
                type="email"
                id="email"
                name="email"
                required
                className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex items-center gap-8">
            <label htmlFor="password" className="w-40 text-[#000000] font-medium">
              Password :
            </label>
            <div className="flex-1">
              <input
                type="password"
                id="password"
                name="password"
                required
                className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-12 py-3 rounded-lg text-lg font-medium"
            >
              Add Admin
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

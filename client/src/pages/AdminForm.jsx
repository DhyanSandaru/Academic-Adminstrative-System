import { useState } from "react";

export default function AddAdminForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePhoto: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePhoto: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      if (formData.profilePhoto) {
        form.append("profilePhoto", formData.profilePhoto);
      }

      const res = await fetch("http://localhost:5000/api/admins", {
        method: "POST",
        body: form
      });

      const data = await res.json();
      if (res.ok) {
        alert("Admin added successfully!");
        setFormData({ name: "", email: "", password: "", profilePhoto: null });
      } else {
        alert(data.message || "Failed to add admin");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="flex-1 p-8">
      <form className="space-y-8 max-w-4xl mx-auto" onSubmit={handleSubmit}>
        {/* Admin Name */}
        <div className="flex items-center gap-8">
          <label htmlFor="name" className="w-40 text-[#000000] font-medium">
            Admin Name :
          </label>
          <div className="flex-1">
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
            />
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex items-center gap-8">
          <label htmlFor="profilePhoto" className="w-40 text-[#000000] font-medium">
            Profile Photo :
          </label>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={handleFileChange}
                className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-60"
              />
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("profilePhoto").click()}
              className="bg-[#253d90] hover:bg-[#1e2f7a] text-white px-6 py-2 rounded-lg"
            >
              Choose
            </button>
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="border-0 border-b-2 border-[#000000] rounded-none bg-transparent focus:ring-0 focus:border-[#253d90] w-90"
            />
          </div>
        </div>

        {/* Confirm Button */}
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
  );
}

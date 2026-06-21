import { useState } from "react";
import axios from "axios";

export default function AddAdminForm({ setShowForm }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", status: "", nic: "", address: "", gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    let validationErrors = {};

    const requiredFields = [
      "name",
      "email",
      "password",
      "confirmPassword",
      "phone",
      "status",
      "nic",
      "address",
    ];

    // Validate required fields
    for (let field of requiredFields) {
      const fieldElement = form.elements.namedItem(field);
      const value = fieldElement?.value?.trim();

      if (!value) {
        validationErrors[field] =
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    }

    // Check gender selection
    const genderChecked = form.querySelector('input[name="gender"]:checked');
    if (!genderChecked) {
      validationErrors.gender = "Please select a gender";
    }

    // Password match check
    const password = form.elements.namedItem("password")?.value || "";
    const confirmPassword = form.elements.namedItem("confirmPassword")?.value || "";

    if (password && confirmPassword && password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
  

    // If there are errors, display them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      const gender = form.querySelector('input[name="gender"]:checked')?.value || "";

      const formData = new FormData();
      formData.append("name", form.elements.namedItem("name")?.value || "");
      formData.append("email", form.elements.namedItem("email")?.value || "");
      formData.append("password", form.elements.namedItem("password")?.value || "");
      formData.append("phone", form.elements.namedItem("phone")?.value || "");
      formData.append("status", form.elements.namedItem("status")?.value || "");
      formData.append("nic", form.elements.namedItem("nic")?.value || "");
      formData.append("address", form.elements.namedItem("address")?.value || "");
      formData.append("gender", gender);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);

      const res = await axios.post("http://localhost:8000/api/admins/add-admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        alert("Admin added successfully!");
        form.reset();
        setProfilePhoto(null);
        setErrors({});
        if (setShowForm) setShowForm(false);
      } else {
        alert(res.data.message || "Failed to add admin");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 rounded-2xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-12 w-3xl max-w-5xl mx-auto p-5">
        {/* Profile Section */}
        <div className="border-b border-gray-200 pb-12 flex flex-col">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-md text-gray-600">
            Basic details about the administrator.
          </p>

          <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-8">
            {/* Admin Name */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="name" className="block text-md font-medium">
                Admin Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`mt-2 block w-full rounded-md bg-white px-3 py-1.5 border-2 focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Profile Photo */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="profile-photo" className="block text-md font-medium">
                Profile Photo
              </label>
              <div className="w-full my-5 flex flex-col items-center justify-between gap-y-5">
                {profilePhoto ? (
                  <img
                    src={URL.createObjectURL(profilePhoto)}
                    alt="preview"
                    className="w-40 h-40 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No Photo
                  </div>
                )}
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="profile-photo"
                  className="cursor-pointer rounded-md bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200"
                >
                  Change
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="border-b border-gray-200 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="mt-1 text-md text-gray-600">
            Personal details and login credentials.
          </p>

          {/* Gender */}
          <div className="mt-5">
            <label className="block text-md font-medium">Gender</label>
            <div className="mt-2 flex gap-x-6">
              {["male", "female", "other"].map((g) => (
                <label key={g} className="flex items-center gap-x-2 text-md">
                  <input type="radio" name="gender" value={g} className="text-indigo-500" />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}
          </div>

          <div className="mt-10 w-[85%] grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Email */}
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-md font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-md font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* NIC */}
            <div className="sm:col-span-3">
              <label htmlFor="nic" className="block text-md font-medium">
                NIC
              </label>
              <input
                id="nic"
                name="nic"
                type="text"
                className={`mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 ${
                  errors.nic ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
            </div>

            {/* Status */}
            <div className="sm:col-span-3 w-full">
              <label htmlFor="status" className="block text-md font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 border-gray-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Address */}
            <div className="col-span-full">
              <label htmlFor="address" className="block text-md font-medium">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                className={`mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Password */}
            <div className="sm:col-span-3">
              <label htmlFor="password" className="block text-md font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="sm:col-span-3">
              <label htmlFor="confirmPassword" className="block text-md font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`mt-2 block w-full rounded-md bg-white border-2 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-center gap-4">
          {setShowForm && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md bg-gray-500 px-10 py-3 text-white font-medium hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-10 py-3 text-white font-medium hover:bg-indigo-500"
          >
            Add Admin
          </button>
        </div>
      </form>
    </div>
  );
}
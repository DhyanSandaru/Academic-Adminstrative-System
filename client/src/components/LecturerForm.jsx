import { useState } from "react";
import axios from "axios";

export default function LecturerForm() {
  const [courseModules, setCourseModules] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const addCourseModule = () => {
    const newModule = prompt("Enter subject name:");
    if (newModule) {
      setCourseModules([...courseModules, newModule]);
    }
  };

  const removeCourseModule = (moduleToRemove) => {
    setCourseModules(courseModules.filter((module) => module !== moduleToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("lecturerName", form["lecturer-name"].value);
    formData.append("profilePhoto", profilePhoto);
    formData.append("gender", form["gender"].value);
    formData.append("qualifications", form["qualifications"].value);
    formData.append("email", form["email"].value);
    formData.append("nic", form["nic"].value);
    formData.append("mobile", form["mobile"].value);
    formData.append("address", form["address"].value);
    formData.append("examYear", form["exam-year"].value);
    formData.append("exam", form["exam"].value);
    formData.append("courseModules", JSON.stringify(courseModules));

    try {
      const res = await axios.post("http://localhost:8000/add-lecturer", formData);
      alert(res.data.message || "Lecturer added successfully!");
      form.reset();
      setCourseModules([]);
      setProfilePhoto(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission Failed");
    }
  };

  return (
    <div className="flex-1 p-8 bg-[#0f172a] min-h-screen text-white rounded-2xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-12 w-3xl max-w-5xl mx-auto p-5">
        {/* Profile Section */}
        <div className="border-b border-white/10 pb-12 flex flex-col">
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="mt-1 text-md text-gray-400">
            Basic details about the lecturer and their subjects.
          </p>

          <div className="mt-10 flex flex-col items-center gap-x-6 gap-y-8">
            {/* Lecturer Name */}
            <div className="sm:col-span-3">
              <label htmlFor="lecturer-name" className="block text-md font-medium">
                Lecturer Name
              </label>
              <div className="mt-2">
                <input
                  id="lecturer-name"
                  type="text"
                  className="block w-md rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-white placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="sm:col-span-3">
              <label htmlFor="profile-photo" className="block text-md font-medium">
                Profile Photo
              </label>
              <div className="w-full my-5 flex flex-col items-center justify-between gap-y-5 ">
                {profilePhoto ? (
                  <img
                    src={URL.createObjectURL(profilePhoto)}
                    alt="preview"
                    className="w-40 h-40 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
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
                  className="cursor-pointer rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
                >
                  Change
                </label>
              </div>
            </div>

            {/* Subjects Taught */}
            <div className="col-span-full">
              <label className="block text-md font-medium">Subjects Taught</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {courseModules.map((module) => (
                  <div
                    key={module}
                    className="bg-indigo-600 text-white pl-2 py-1 rounded-md flex items-center"
                  >
                    {module}
                    <button
                      type="button"
                      onClick={() => removeCourseModule(module)}
                      className="ml-2 text-white hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCourseModule}
                  className="rounded-md bg-white/10 px-3 py-1 text-sm font-medium hover:bg-white/20"
                >
                  + Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="border-b border-white/10 pb-12 flex flex-col items-center">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <p className="mt-1 text-md text-gray-400">
            Contact details and identification information.
          </p>

          {/* Gender */}
          <div className="sm:col-span-3">
            <label className="block text-md font-medium">Gender</label>
            <div className="mt-2 flex gap-x-6">
              {["male", "female", "other"].map((g) => (
                <label key={g} className="flex items-center gap-x-2 text-md">
                  <input type="radio" name="gender" value={g} className="text-indigo-500" />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

            {/* Exam & Year */}
            <div className="sm:col-span-3">
              <label htmlFor="exam" className="block text-md font-medium">
                Exam & Year
              </label>
              <div className="mt-2 flex gap-4">
                {/* Exam Dropdown */}
                <select
                  id="exam"
                  name="exam"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500"
                >
                  <option value="">Select Exam</option>
                  <option value="O/L">O/L</option>
                  <option value="A/L">A/L</option>
                  <option value="IELTS">IELTS</option>
                  <option value="Other">Other</option>
                </select>

                {/* Year Dropdown */}
                <select
                  id="exam-year"
                  name="exam-year"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500"
                >
                  <option value="">Select Year</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
            </div>


            {/* Email */}
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-md font-medium">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* NIC */}
            <div className="sm:col-span-3">
              <label htmlFor="nic" className="block text-md font-medium">
                NIC
              </label>
              <div className="mt-2">
                <input
                  id="nic"
                  type="text"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="sm:col-span-3">
              <label htmlFor="mobile" className="block text-md font-medium">
                Mobile No
              </label>
              <div className="mt-2">
                <input
                  id="mobile"
                  type="text"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Qualifications */}
            <div className="col-span-full">
              <label htmlFor="qualifications" className="block text-md font-medium">
                Qualifications
              </label>
              <div className="mt-2">
                <textarea
                  id="qualifications"
                  rows="3"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 placeholder:text-gray-500"
                ></textarea>
              </div>
            </div>

            {/* Address */}
            <div className="col-span-full">
              <label htmlFor="address" className="block text-md font-medium">
                Address
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  type="text"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-10 py-3 text-white font-medium hover:bg-indigo-500"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
